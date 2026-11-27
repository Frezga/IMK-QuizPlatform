import { computed, ref } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import {
  BADGES_CATALOG,
  HEURISTICS_DATA,
  SAMPLE_LEADERBOARD_USERS,
} from '@/data/missionsData'

const USER_ID_STORAGE_KEY = 'heurilab_user_id'
const FALLBACK_USERS_KEY = 'heurilab_fallback_users'
const FALLBACK_LOGS_KEY = 'heurilab_fallback_logs'

// State singleton reaktif global agar konsisten di Navbar, HomeView, ArenaView, & LeaderboardView
const currentUser = ref(null)
const missionLogs = ref([])
const isLoadingSession = ref(true)
const showGuestLoginModal = ref(false)
const isFallbackMode = ref(!isSupabaseConfigured)
const sessionInitialized = ref(false)
const sessionNotice = ref('')

/**
 * Sanitasi Nama Panggilan / Alias tamu:
 * - Hapus tag HTML/script
 * - Hapus karakter berbahaya (< > " ' ` & / \) dan karakter kontrol
 * - Trim spasi berlebih dan batasi maksimal 25 karakter
 */
export function sanitizeAlias(rawInput) {
  if (typeof rawInput !== 'string') return ''
  return rawInput
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"'`&/\\]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 25)
}

function generateLocalUuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function readLocalJson(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch {
    return defaultValue
  }
}

function writeLocalJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Abaikan kuota penuh secara aman
  }
}

function normalizeBadges(rawBadges) {
  return Array.isArray(rawBadges) ? rawBadges : []
}

function computeUnlockedBadgeIds(logs, totalScore) {
  const completedCodes = Array.from(
    new Set(logs.filter((l) => l.is_correct).map((l) => l.heuristic_code))
  )
  return BADGES_CATALOG.filter((badge) =>
    badge.checkUnlocked({ completedCodes, totalScore, logs })
  ).map((badge) => badge.id)
}

function shouldFallbackFromSupabaseError(error) {
  if (!error) return false
  const msg = `${error.message || ''} ${error.details || ''}`.toLowerCase()
  return (
    msg.includes('failed to fetch') ||
    msg.includes('fetch') ||
    msg.includes('network') ||
    msg.includes('invalid api key') ||
    msg.includes('jwt') ||
    msg.includes('apikey')
  )
}

export function useGameSession() {
  const completedHeuristicCodes = computed(() => {
    const set = new Set()
    for (const log of missionLogs.value) {
      if (log.is_correct && log.heuristic_code) {
        set.add(log.heuristic_code)
      }
    }
    return Array.from(set)
  })

  const completedCount = computed(() => {
    return HEURISTICS_DATA.filter((h) =>
      completedHeuristicCodes.value.includes(h.missionCode)
    ).length
  })

  const heuristicMasteryMap = computed(() => {
    const map = {}
    for (const h of HEURISTICS_DATA) {
      map[h.missionCode] = completedHeuristicCodes.value.includes(h.missionCode) ? 100 : 0
    }
    return map
  })

  const userBadges = computed(() => normalizeBadges(currentUser.value?.badges))
  const totalScore = computed(() => currentUser.value?.total_score ?? 0)

  const recommendedNextHeuristic = computed(() => {
    const incomplete = HEURISTICS_DATA.filter(
      (h) => (heuristicMasteryMap.value[h.missionCode] ?? 0) < 100
    )
    if (incomplete.length === 0) {
      return HEURISTICS_DATA.find((h) => h.isFocus) || HEURISTICS_DATA[0]
    }
    const focusIncomplete = incomplete.find((h) => h.isFocus)
    return focusIncomplete || incomplete[0]
  })

  async function initSession(force = false) {
    if (sessionInitialized.value && !force) return
    sessionInitialized.value = true
    isLoadingSession.value = true
    sessionNotice.value = ''

    const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY)

    if (!storedUserId) {
      currentUser.value = null
      missionLogs.value = []
      showGuestLoginModal.value = true
      isLoadingSession.value = false
      return
    }

    if (supabase && !isFallbackMode.value) {
      try {
        const { data: userRow, error: userError } = await supabase
          .from('users')
          .select('id, name, total_score, badges, created_at')
          .eq('id', storedUserId)
          .maybeSingle()

        if (userError) {
          if (shouldFallbackFromSupabaseError(userError)) {
            isFallbackMode.value = true
          } else {
            throw userError
          }
        } else if (!userRow) {
          // Edge-case penting: ID tersimpan di localStorage sudah tidak ada di Supabase
          // (misalnya dihapus manual oleh admin di Supabase Table Editor)
          localStorage.removeItem(USER_ID_STORAGE_KEY)
          currentUser.value = null
          missionLogs.value = []
          showGuestLoginModal.value = true
          isLoadingSession.value = false
          return
        } else {
          currentUser.value = {
            ...userRow,
            badges: normalizeBadges(userRow.badges),
          }

          const { data: logsData, error: logsError } = await supabase
            .from('mission_logs')
            .select('id, user_id, heuristic_code, is_correct, attempts, time_spent_seconds, created_at')
            .eq('user_id', storedUserId)
            .order('created_at', { ascending: false })

          if (!logsError && Array.isArray(logsData)) {
            missionLogs.value = logsData
          }

          showGuestLoginModal.value = false
          isLoadingSession.value = false
          return
        }
      } catch {
        isFallbackMode.value = true
      }
    }

    // Mode Fallback Aman (localStorage) jika .env belum diisi atau Supabase tidak terjangkau
    const localUsers = readLocalJson(FALLBACK_USERS_KEY, [])
    const matchedLocal = localUsers.find((u) => u.id === storedUserId)

    if (!matchedLocal) {
      localStorage.removeItem(USER_ID_STORAGE_KEY)
      currentUser.value = null
      missionLogs.value = []
      showGuestLoginModal.value = true
      isLoadingSession.value = false
      return
    }

    currentUser.value = {
      ...matchedLocal,
      badges: normalizeBadges(matchedLocal.badges),
    }
    const allLocalLogs = readLocalJson(FALLBACK_LOGS_KEY, [])
    missionLogs.value = allLocalLogs.filter((l) => l.user_id === storedUserId)
    showGuestLoginModal.value = false
    isLoadingSession.value = false
  }

  async function registerGuest(rawName) {
    const cleanName = sanitizeAlias(rawName)
    if (!cleanName) {
      return { ok: false, error: 'Nama panggilan wajib diisi (1–25 karakter).' }
    }

    if (supabase && !isFallbackMode.value) {
      try {
        const { data, error } = await supabase
          .from('users')
          .insert({
            name: cleanName,
            total_score: 0,
            badges: [],
          })
          .select('id, name, total_score, badges, created_at')
          .single()

        if (error) {
          if (shouldFallbackFromSupabaseError(error)) {
            isFallbackMode.value = true
          } else {
            return { ok: false, error: 'Gagal membuat sesi tamu. Silakan coba lagi.' }
          }
        } else if (data) {
          localStorage.setItem(USER_ID_STORAGE_KEY, data.id)
          currentUser.value = {
            ...data,
            badges: normalizeBadges(data.badges),
          }
          missionLogs.value = []
          showGuestLoginModal.value = false
          return { ok: true, user: currentUser.value }
        }
      } catch {
        isFallbackMode.value = true
      }
    }

    // Simpan ke fallback localStorage jika Supabase belum aktif
    const newUser = {
      id: generateLocalUuid(),
      name: cleanName,
      total_score: 0,
      badges: [],
      created_at: new Date().toISOString(),
    }

    const localUsers = readLocalJson(FALLBACK_USERS_KEY, [])
    localUsers.push(newUser)
    writeLocalJson(FALLBACK_USERS_KEY, localUsers)
    localStorage.setItem(USER_ID_STORAGE_KEY, newUser.id)

    currentUser.value = newUser
    missionLogs.value = []
    showGuestLoginModal.value = false
    return { ok: true, user: newUser }
  }

  async function submitMissionCompletion({
    heuristicCode,
    isCorrect,
    attempts = 1,
    timeSpentSeconds = 0,
  }) {
    if (!currentUser.value) {
      showGuestLoginModal.value = true
      return { pointsEarned: 0, newlyUnlockedBadges: [] }
    }

    const alreadyCompleted = completedHeuristicCodes.value.includes(heuristicCode)
    const pointsEarned = isCorrect && !alreadyCompleted ? 100 : 0

    const logPayload = {
      user_id: currentUser.value.id,
      heuristic_code: heuristicCode,
      is_correct: Boolean(isCorrect),
      attempts: Math.max(1, Number(attempts) || 1),
      time_spent_seconds: Math.max(0, Math.round(Number(timeSpentSeconds) || 0)),
    }

    let insertedLog = {
      id: generateLocalUuid(),
      ...logPayload,
      created_at: new Date().toISOString(),
    }

    const nextLogs = [insertedLog, ...missionLogs.value]
    const nextScore = (currentUser.value.total_score || 0) + pointsEarned
    const prevBadges = normalizeBadges(currentUser.value.badges)
    const nextBadges = computeUnlockedBadgeIds(nextLogs, nextScore)
    const newlyUnlockedBadges = nextBadges.filter((id) => !prevBadges.includes(id))

    if (supabase && !isFallbackMode.value) {
      try {
        const { data: savedLog, error: logError } = await supabase
          .from('mission_logs')
          .insert(logPayload)
          .select('id, user_id, heuristic_code, is_correct, attempts, time_spent_seconds, created_at')
          .single()

        if (logError && shouldFallbackFromSupabaseError(logError)) {
          isFallbackMode.value = true
        } else {
          if (savedLog) insertedLog = savedLog

          if (isCorrect) {
            await supabase
              .from('users')
              .update({
                total_score: nextScore,
                badges: nextBadges,
              })
              .eq('id', currentUser.value.id)
          }
        }
      } catch {
        isFallbackMode.value = true
      }
    }

    if (isFallbackMode.value) {
      const localLogs = readLocalJson(FALLBACK_LOGS_KEY, [])
      localLogs.unshift(insertedLog)
      writeLocalJson(FALLBACK_LOGS_KEY, localLogs)

      if (isCorrect) {
        const localUsers = readLocalJson(FALLBACK_USERS_KEY, [])
        const idx = localUsers.findIndex((u) => u.id === currentUser.value.id)
        if (idx !== -1) {
          localUsers[idx] = {
            ...localUsers[idx],
            total_score: nextScore,
            badges: nextBadges,
          }
          writeLocalJson(FALLBACK_USERS_KEY, localUsers)
        }
      }
    }

    missionLogs.value = [insertedLog, ...missionLogs.value]
    if (isCorrect) {
      currentUser.value = {
        ...currentUser.value,
        total_score: nextScore,
        badges: nextBadges,
      }
    }

    return {
      pointsEarned,
      alreadyCompleted,
      newlyUnlockedBadges,
    }
  }

  async function fetchClassLeaderboard() {
    let dbUsers = []

    if (supabase && !isFallbackMode.value) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, total_score, badges, created_at')
          .order('total_score', { ascending: false })
          .limit(50)

        if (!error && Array.isArray(data)) {
          dbUsers = data
        } else if (error && shouldFallbackFromSupabaseError(error)) {
          isFallbackMode.value = true
        }
      } catch {
        isFallbackMode.value = true
      }
    }

    if (isFallbackMode.value) {
      dbUsers = readLocalJson(FALLBACK_USERS_KEY, [])
    }

    const merged = dbUsers.map((u) => ({
      id: u.id,
      name: u.name,
      total_score: Number(u.total_score) || 0,
      badges: normalizeBadges(u.badges),
      isSample: false,
    }))

    // Pastikan user aktif tampil dengan nilai terkini
    if (currentUser.value && !merged.some((u) => u.id === currentUser.value.id)) {
      merged.push({
        id: currentUser.value.id,
        name: currentUser.value.name,
        total_score: Number(currentUser.value.total_score) || 0,
        badges: normalizeBadges(currentUser.value.badges),
        isSample: false,
      })
    }

    // Tambahkan data contoh realistis apabila database berisi kurang dari 5 user
    if (merged.length < 5) {
      const existingNames = new Set(merged.map((u) => u.name.toLowerCase()))
      for (const sample of SAMPLE_LEADERBOARD_USERS) {
        if (merged.length >= 5) break
        if (!existingNames.has(sample.name.toLowerCase())) {
          merged.push({ ...sample })
        }
      }
    }

    const activeId = currentUser.value?.id
    return merged
      .sort((a, b) => b.total_score - a.total_score)
      .map((entry, index) => {
        const estimatedMastery = Math.min(100, Math.round((entry.total_score / 1000) * 100))
        const isCurrentUser = Boolean(activeId && entry.id === activeId)
        const masteryPercent = isCurrentUser
          ? Math.round((completedCount.value / 10) * 100)
          : estimatedMastery

        return {
          ...entry,
          rank: index + 1,
          isCurrentUser,
          masteryPercent,
        }
      })
  }

  function openGuestModal() {
    showGuestLoginModal.value = true
  }

  return {
    currentUser,
    missionLogs,
    isLoadingSession,
    showGuestLoginModal,
    isFallbackMode,
    sessionNotice,
    completedHeuristicCodes,
    completedCount,
    heuristicMasteryMap,
    userBadges,
    totalScore,
    recommendedNextHeuristic,
    initSession,
    registerGuest,
    submitMissionCompletion,
    fetchClassLeaderboard,
    openGuestModal,
    sanitizeAlias,
  }
}

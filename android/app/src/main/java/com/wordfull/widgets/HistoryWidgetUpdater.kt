package com.wordfull.widgets

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

object HistoryWidgetUpdater {
    private const val PREFS_NAME = "history_widget_prefs"

    private const val KEY_BG_COLOR = "bg_color"
    private const val KEY_TEXT_COLOR = "text_color"
    private const val KEY_BAR_MAIN_COLOR = "bar_main_color"
    private const val KEY_BAR_ACCENT_COLOR = "bar_accent_color"
    private const val KEY_BAR_MUTED_COLOR = "bar_muted_color"

    private const val KEY_LANGUAGE = "language"

    private const val KEY_TOTAL_WORDS = "total_words"
    private const val KEY_BARS = "bars"
    private const val KEY_ANCHOR_DATE = "anchor_date"

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)

    fun saveTheme(
        context: Context,
        bgColor: String,
        textColor: String,
        barMainColor: String,
        barAccentColor: String,
        barMutedColor: String,
    ) {
        prefs(context).edit()
            .putString(KEY_BG_COLOR, bgColor)
            .putString(KEY_TEXT_COLOR, textColor)
            .putString(KEY_BAR_MAIN_COLOR, barMainColor)
            .putString(KEY_BAR_ACCENT_COLOR, barAccentColor)
            .putString(KEY_BAR_MUTED_COLOR, barMutedColor)
            .apply()
    }

    fun saveLanguage(
        context: Context,
        language: String,
    ) {
        prefs(context).edit()
            .putString(KEY_LANGUAGE, language)
            .apply()
    }

    fun saveStats(
        context: Context,
        totalWords: Int,
        bars: String,
        anchorDate: String
    ) {
        prefs(context).edit()
            .putInt(KEY_TOTAL_WORDS, totalWords)
            .putString(KEY_BARS, bars)
            .putString(KEY_ANCHOR_DATE, anchorDate)
            .apply()
    }

    fun getBgColor(context: Context): String =
        prefs(context).getString(KEY_BG_COLOR, "#F4F1E8") ?: "#F4F1E8"

    fun getTextColor(context: Context): String =
        prefs(context).getString(KEY_TEXT_COLOR, "#2E2E2E") ?: "#2E2E2E"

    fun getBarMainColor(context: Context): String =
        prefs(context).getString(KEY_BAR_MAIN_COLOR, "#7E9783") ?: "#7E9783"

    fun getBarAccentColor(context: Context): String =
        prefs(context).getString(KEY_BAR_ACCENT_COLOR, "#B8A06A") ?: "#B8A06A"

    fun getBarMutedColor(context: Context): String =
        prefs(context).getString(KEY_BAR_MUTED_COLOR, "#D8D2C2") ?: "#D8D2C2"

    fun getLanguage(context: Context): String =
        prefs(context).getString(KEY_LANGUAGE, "en") ?: "en"

    fun getTotalWords(context: Context): Int =
        prefs(context).getInt(KEY_TOTAL_WORDS, 0)

    fun getBars(context: Context): List<Int> {
        val json = prefs(context).getString(KEY_BARS, null) ?: return listOf(0, 0, 0, 0, 0, 0, 0)

        return try {
            val arr = JSONArray(json)
            List(arr.length()) { arr.getInt(it) }
        } catch (_: Exception) {
            listOf(0, 0, 0, 0, 0, 0, 0)
        }
    }

    fun refreshAllWidgets(context: Context) {
        val appWidgetManager = AppWidgetManager.getInstance(context)
        val componentName = ComponentName(context, HistoryWidgetReceiver::class.java)
        val ids = appWidgetManager.getAppWidgetIds(componentName)

        ids.forEach { widgetId ->
            HistoryWidgetReceiver.updateWidget(context, appWidgetManager, widgetId)
        }
    }

    fun rollStatsToTodayIfNeeded(context: Context) {
        val anchorDate = prefs(context).getString(KEY_ANCHOR_DATE, null) ?: return
        val todayDate = getTodayDateString()

        if (anchorDate == todayDate) return

        val diffDays = getPositiveDayDifference(anchorDate, todayDate)
        if (diffDays <= 0) return

        val currentBars = getBars(context).toMutableList()
        val normalizedBars = normalizeBars(currentBars)

        repeat(diffDays.coerceAtMost(7)) {
            if (normalizedBars.isNotEmpty()) {
                normalizedBars.removeAt(0)
            }
            normalizedBars.add(0)
        }

        val totalWords = normalizedBars.sum()

        saveStats(
            context = context,
            totalWords = totalWords,
            bars = JSONArray(normalizedBars).toString(),
            anchorDate = todayDate
        )
    }

    private fun normalizeBars(bars: List<Int>): MutableList<Int> {
        return when {
            bars.size >= 7 -> bars.takeLast(7).toMutableList()
            bars.isEmpty() -> mutableListOf(0, 0, 0, 0, 0, 0, 0)
            else -> {
                val result = MutableList(7 - bars.size) { 0 }
                result.addAll(bars)
                result
            }
        }
    }

    private fun getTodayDateString(): String {
        val cal = Calendar.getInstance()
        return dateFormat.format(cal.time)
    }

    private fun getPositiveDayDifference(fromDate: String, toDate: String): Int {
        return try {
            val from = Calendar.getInstance().apply {
                time = dateFormat.parse(fromDate)!!
                set(Calendar.HOUR_OF_DAY, 0)
                set(Calendar.MINUTE, 0)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }

            val to = Calendar.getInstance().apply {
                time = dateFormat.parse(toDate)!!
                set(Calendar.HOUR_OF_DAY, 0)
                set(Calendar.MINUTE, 0)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }

            var diff = 0
            while (from.before(to)) {
                from.add(Calendar.DAY_OF_YEAR, 1)
                diff++
            }
            diff
        } catch (_: Exception) {
            0
        }
    }

    private fun prefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }
}
package com.wordfull.widgets

import android.appwidget.AppWidgetManager
import android.content.Intent
import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import android.graphics.Color
import android.app.PendingIntent
import android.os.Bundle
import android.util.TypedValue
import android.widget.RemoteViews
import com.wordfull.MainActivity
import com.wordfull.R
import org.json.JSONArray
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale
import com.wordfull.widgets.HistoryWidgetReceiver

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

    fun update(
        context: Context,
        appWidgetManager: AppWidgetManager,
        widgetId: Int,
    ) {
        rollStatsToTodayIfNeeded(context)

        val options = appWidgetManager.getAppWidgetOptions(widgetId)
        val compact = isCompactWidget(options)
        val layoutId = if (compact) R.layout.history_widget_short else R.layout.history_widget_tall

        val language = getLanguage(context)
        val bars = normalizeBars(getBars(context))

        val widthPx = getApproxChartWidthPx(context, options)
        val heightPx = if (compact) dp(context, 82f) else dp(context, 128f)

        val totalWords = getTotalWords(context)

        val chartBitmap = HistoryWidgetChartRenderer.render(
            context = context,
            widthPx = widthPx,
            heightPx = heightPx,
            bars = bars,
            weekdayLabels = getRollingWeekdayLabels(language),
            textColor = parseColorOrDefault(getTextColor(context), "#2E2E2E"),
            mainColor = parseColorOrDefault(getBarMainColor(context), "#7E9783"),
            accentColor = parseColorOrDefault(getBarAccentColor(context), "#B8A06A"),
            mutedColor = parseColorOrDefault(getBarMutedColor(context), "#D8D2C2"),
            showWeekdayLabels = !compact,
            compactMode = compact,
        )

        val remoteViews = RemoteViews(context.packageName, layoutId).apply {
            val textColor = parseColorOrDefault(getTextColor(context), "#2E2E2E")
            val bgColor = parseColorOrDefault(getBgColor(context), "#F4F1E8")

            setInt(R.id.widget_root, "setBackgroundColor", bgColor)
            setTextColor(R.id.widget_value, textColor)
            setImageViewBitmap(R.id.widget_chart, chartBitmap)
            setTextViewText(R.id.widget_value, getValueText(language, totalWords))

            if (!compact) {
                setTextColor(R.id.widget_title, textColor)
                setTextViewText(R.id.widget_title, getWeeklyTitleForLanguage(language))
            }

            setOnClickPendingIntent(R.id.widget_root, createLaunchPendingIntent(context))
        }

        appWidgetManager.updateAppWidget(widgetId, remoteViews)
    }

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
            update(context, appWidgetManager, widgetId)
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

    private fun isCompactWidget(options: Bundle?): Boolean {
        val minWidthDp = options?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 250) ?: 250
        return minWidthDp < 280
    }

    private fun getApproxChartWidthPx(context: Context, options: Bundle?): Int {
        val minWidthDp = options?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 250) ?: 250
        return dp(context, minWidthDp.toFloat())
    }

    private fun parseColorOrDefault(colorHex: String, fallback: String): Int {
        return try {
            Color.parseColor(colorHex)
        } catch (_: Exception) {
            Color.parseColor(fallback)
        }
    }

    private fun getRollingWeekdayLabels(language: String): List<String> {
        val labels = mutableListOf<String>()
        val today = Calendar.getInstance()

        for (i in 6 downTo 0) {
            val cal = today.clone() as Calendar
            cal.add(Calendar.DAY_OF_YEAR, -i)

            val dayOfWeek = cal.get(Calendar.DAY_OF_WEEK)
            val label = when (language.lowercase(Locale.ROOT)) {
                "uk" -> when (dayOfWeek) {
                    Calendar.MONDAY -> "Пн"
                    Calendar.TUESDAY -> "Вт"
                    Calendar.WEDNESDAY -> "Ср"
                    Calendar.THURSDAY -> "Чт"
                    Calendar.FRIDAY -> "Пт"
                    Calendar.SATURDAY -> "Сб"
                    Calendar.SUNDAY -> "Нд"
                    else -> ""
                }

                else -> when (dayOfWeek) {
                    Calendar.MONDAY -> "M"
                    Calendar.TUESDAY -> "T"
                    Calendar.WEDNESDAY -> "W"
                    Calendar.THURSDAY -> "T"
                    Calendar.FRIDAY -> "F"
                    Calendar.SATURDAY -> "S"
                    Calendar.SUNDAY -> "S"
                    else -> ""
                }
            }

            labels.add(label)
        }

        return labels
    }

    private fun getWeeklyTitleForLanguage(language: String): String {
        return when (language.lowercase(Locale.ROOT)) {
            "uk" -> "Вивчених слів за тиждень"
            else -> "Words memorized in a week"
        }
    }

    private fun getValueText(language: String, totalWords: Int): String {
        return when (language.lowercase(Locale.ROOT)) {
            "uk" -> "$totalWords ${getUkrainianWordForm(totalWords)}"
            else -> "$totalWords ${if (totalWords == 1) "word" else "words"}"
        }
    }

    private fun getUkrainianWordForm(count: Int): String {
        val mod10 = count % 10
        val mod100 = count % 100

        return when {
            mod100 in 11..14 -> "слів"
            mod10 == 1 -> "слово"
            mod10 in 2..4 -> "слова"
            else -> "слів"
        }
    }

    private fun createLaunchPendingIntent(context: Context): PendingIntent {
        val launchIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        return PendingIntent.getActivity(
            context,
            0,
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    private fun dp(context: Context, value: Float): Int {
        return TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            value,
            context.resources.displayMetrics
        ).toInt()
    }
}
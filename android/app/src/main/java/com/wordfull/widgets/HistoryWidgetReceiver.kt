package com.wordfull.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.widget.RemoteViews
import com.wordfull.MainActivity
import com.wordfull.R
import java.util.Calendar

class HistoryWidgetReceiver : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        appWidgetIds.forEach { appWidgetId ->
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)

        if (intent.action == AppWidgetManager.ACTION_APPWIDGET_UPDATE) {
            val manager = AppWidgetManager.getInstance(context)
            val ids = manager.getAppWidgetIds(
                ComponentName(context, HistoryWidgetReceiver::class.java)
            )
            onUpdate(context, manager, ids)
        }
    }

    companion object {
        fun updateWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val views = RemoteViews(context.packageName, R.layout.history_widget)

            val bgColor = safeParseColor(HistoryWidgetUpdater.getBgColor(context), "#F4F1E8")
            val textColor = safeParseColor(HistoryWidgetUpdater.getTextColor(context), "#2E2E2E")
            val barMainColor = safeParseColor(HistoryWidgetUpdater.getBarMainColor(context), "#7E9783")
            val barAccentColor = safeParseColor(HistoryWidgetUpdater.getBarAccentColor(context), "#B8A06A")
            val barMutedColor = safeParseColor(HistoryWidgetUpdater.getBarMutedColor(context), "#D8D2C2")

            val language = HistoryWidgetUpdater.getLanguage(context)
            val totalWords = HistoryWidgetUpdater.getTotalWords(context)
            val bars = normalizeBars(HistoryWidgetUpdater.getBars(context))
            val weekdayLabels = getRollingWeekdayLabels(language)

            val titleText = when (language) {
                "uk" -> "Усього вивчених слів за минулий тиждень"
                else -> "Total words memorized in past week"
            }

            val valueText = when (language) {
                "uk" -> "$totalWords ${getUkrainianWordForm(totalWords)}"
                else -> "$totalWords ${if (totalWords == 1) "word" else "words"}"
            }

            views.setInt(R.id.widget_root, "setBackgroundColor", bgColor)
            views.setTextColor(R.id.widget_title, textColor)
            views.setTextColor(R.id.widget_value, textColor)
            views.setTextViewText(R.id.widget_title, titleText)
            views.setTextViewText(R.id.widget_value, valueText)

            val chartBitmap = HistoryWidgetChartRenderer.render(
                context = context,
                widthPx = dp(context, 320f),
                heightPx = dp(context, 110f),
                bars = bars,
                weekdayLabels = weekdayLabels,
                textColor = textColor,
                mainColor = barMainColor,
                accentColor = barAccentColor,
                mutedColor = barMutedColor
            )

            views.setImageViewBitmap(R.id.widget_chart, chartBitmap)

            val intent = Intent(context, MainActivity::class.java)
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }

        private fun getRollingWeekdayLabels(language: String): List<String> {
            val labels = mutableListOf<String>()
            val today = Calendar.getInstance()

            for (i in 6 downTo 0) {
                val cal = today.clone() as Calendar
                cal.add(Calendar.DAY_OF_YEAR, -i)

                val dayOfWeek = cal.get(Calendar.DAY_OF_WEEK)

                val label = when (language) {
                    "uk" -> when (dayOfWeek) {
                        Calendar.MONDAY -> "П"
                        Calendar.TUESDAY -> "В"
                        Calendar.WEDNESDAY -> "С"
                        Calendar.THURSDAY -> "Ч"
                        Calendar.FRIDAY -> "П"
                        Calendar.SATURDAY -> "С"
                        Calendar.SUNDAY -> "Н"
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

        private fun normalizeBars(rawBars: List<Int>): List<Int> {
            return when {
                rawBars.size >= 7 -> rawBars.takeLast(7)
                rawBars.isEmpty() -> listOf(0, 0, 0, 0, 0, 0, 0)
                else -> List(7 - rawBars.size) { 0 } + rawBars
            }
        }

        private fun safeParseColor(value: String, fallback: String): Int {
            return try {
                Color.parseColor(value)
            } catch (_: Exception) {
                Color.parseColor(fallback)
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

        private fun dp(context: Context, value: Float): Int {
            return (value * context.resources.displayMetrics.density).toInt()
        }
    }
}
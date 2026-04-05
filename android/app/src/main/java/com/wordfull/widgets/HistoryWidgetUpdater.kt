package com.wordfull.widgets

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences

object HistoryWidgetUpdater {
    private const val PREFS_NAME = "history_widget_prefs"

    private const val KEY_BG_COLOR = "bg_color"
    private const val KEY_TEXT_COLOR = "text_color"
    private const val KEY_BAR_MAIN_COLOR = "bar_main_color"
    private const val KEY_BAR_ACCENT_COLOR = "bar_accent_color"
    private const val KEY_BAR_MUTED_COLOR = "bar_muted_color"

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

    fun refreshAllWidgets(context: Context) {
        val appWidgetManager = AppWidgetManager.getInstance(context)
        val componentName = ComponentName(context, HistoryWidgetReceiver::class.java)
        val ids = appWidgetManager.getAppWidgetIds(componentName)

        ids.forEach { widgetId ->
            HistoryWidgetReceiver.updateWidget(context, appWidgetManager, widgetId)
        }
    }

    private fun prefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }
}
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

            val bgColor = Color.parseColor(HistoryWidgetUpdater.getBgColor(context))
            val textColor = Color.parseColor(HistoryWidgetUpdater.getTextColor(context))
            val barMainColor = Color.parseColor(HistoryWidgetUpdater.getBarMainColor(context))
            val barAccentColor = Color.parseColor(HistoryWidgetUpdater.getBarAccentColor(context))
            val barMutedColor = Color.parseColor(HistoryWidgetUpdater.getBarMutedColor(context))
            val language = HistoryWidgetUpdater.getLanguage(context)

            val titleText = when (language) {
                "uk" -> "Вивчено слів за останній тиждень"
                else -> "Total words memorized in past week"
            }

            val valueText = when (language) {
                "uk" -> "43 слова"
                else -> "43 words"
            }

            views.setInt(R.id.widget_root, "setBackgroundColor", bgColor)
            views.setTextColor(R.id.widget_title, textColor)
            views.setTextColor(R.id.widget_value, textColor)

            views.setTextViewText(R.id.widget_title, titleText)
            views.setTextViewText(R.id.widget_value, valueText)

            views.setInt(R.id.bar_1, "setColorFilter", barMutedColor)
            views.setInt(R.id.bar_2, "setColorFilter", barMutedColor)
            views.setInt(R.id.bar_3, "setColorFilter", barAccentColor)
            views.setInt(R.id.bar_4, "setColorFilter", barMainColor)
            views.setInt(R.id.bar_5, "setColorFilter", barMainColor)

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
    }
}
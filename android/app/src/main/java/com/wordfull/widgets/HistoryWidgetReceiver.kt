package com.wordfull.widgets

import android.app.AlarmManager
import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.util.Log
import java.util.*
import com.wordfull.widgets.HistoryWidgetUpdater

class HistoryWidgetReceiver : AppWidgetProvider() {

    companion object {
        const val ACTION_UPDATE_WIDGET = "com.wordfull.widget.UPDATE"
        const val ACTION_MIDNIGHT_UPDATE = "com.wordfull.widget.MIDNIGHT_UPDATE"
        private const val MIDNIGHT_ALARM_REQUEST_CODE = 1001
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray,
    ) {
        super.onUpdate(context, appWidgetManager, appWidgetIds)
        HistoryWidgetUpdater.rollStatsToTodayIfNeeded(context)
        appWidgetIds.forEach { widgetId ->
            HistoryWidgetUpdater.update(context, appWidgetManager, widgetId)
        }
        scheduleMidnightUpdate(context)
    }

    override fun onEnabled(context: Context) {
        super.onEnabled(context)
        Log.d("HistoryWidget", "onEnabled → scheduling midnight update")
        scheduleMidnightUpdate(context)
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)

        Log.d("HistoryWidget", "onReceive: ${intent.action}")

        when (intent.action) {

            ACTION_UPDATE_WIDGET -> {
                HistoryWidgetUpdater.rollStatsToTodayIfNeeded(context)
                updateWidget(context)

                // ensure next midnight is scheduled
                scheduleMidnightUpdate(context)
            }

            ACTION_MIDNIGHT_UPDATE -> {
                Log.d("HistoryWidget", "Midnight alarm received")
                HistoryWidgetUpdater.rollStatsToTodayIfNeeded(context)
                updateWidget(context)

                // reschedule next midnight
                scheduleMidnightUpdate(context)
            }

            Intent.ACTION_DATE_CHANGED,
            Intent.ACTION_TIME_CHANGED,
            Intent.ACTION_TIMEZONE_CHANGED,
            Intent.ACTION_BOOT_COMPLETED,
            Intent.ACTION_MY_PACKAGE_REPLACED -> {

                Log.d("HistoryWidget", "System broadcast → ${intent.action}")

                HistoryWidgetUpdater.rollStatsToTodayIfNeeded(context)
                updateWidget(context)

                // always ensure alarm exists
                scheduleMidnightUpdate(context)
            }
        }
    }

    private fun updateWidget(context: Context) {
        val manager = AppWidgetManager.getInstance(context)
        val component = android.content.ComponentName(context, HistoryWidgetReceiver::class.java)
        val ids = manager.getAppWidgetIds(component)

        for (id in ids) {
            HistoryWidgetUpdater.update(context, manager, id)
        }
    }

    /**
     * Schedules exact update at next midnight
     */
    private fun scheduleMidnightUpdate(context: Context) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        val intent = Intent(context, HistoryWidgetReceiver::class.java).apply {
            action = ACTION_MIDNIGHT_UPDATE
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            MIDNIGHT_ALARM_REQUEST_CODE,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val calendar = Calendar.getInstance().apply {
            timeInMillis = System.currentTimeMillis()
            add(Calendar.DAY_OF_YEAR, 1)
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 5)
        }

        try {
            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                calendar.timeInMillis,
                pendingIntent
            )
        } catch (_: SecurityException) {
            alarmManager.setAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                calendar.timeInMillis,
                pendingIntent
            )
        }

        Log.d("HistoryWidget", "Scheduled midnight update at ${calendar.time}")
    }
}
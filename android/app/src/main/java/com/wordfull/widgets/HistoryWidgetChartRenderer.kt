package com.wordfull.widgets

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.Typeface
import kotlin.math.max
import kotlin.math.min

object HistoryWidgetChartRenderer {

    fun render(
        context: Context,
        widthPx: Int,
        heightPx: Int,
        bars: List<Int>,
        weekdayLabels: List<String>,
        textColor: Int,
        mainColor: Int,
        accentColor: Int,
        mutedColor: Int,
        showWeekdayLabels: Boolean,
        compactMode: Boolean,
    ): Bitmap {
        val safeWidth = max(widthPx, dp(context, 140f))
        val safeHeight = max(heightPx, dp(context, 40f))

        val bitmap = Bitmap.createBitmap(safeWidth, safeHeight, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)

        val totalBars = 7
        val horizontalPadding = if (compactMode) dp(context, 2f) else dp(context, 4f)
        val topPadding = if (compactMode) dp(context, 2f) else dp(context, 4f)
        val bottomPadding = if (compactMode) dp(context, 2f) else dp(context, 4f)

        val labelsAreaHeight = if (showWeekdayLabels) dp(context, 22f) else 0
        val barAreaHeight = safeHeight - labelsAreaHeight - bottomPadding

        val chartLeft = horizontalPadding.toFloat()
        val chartRight = (safeWidth - horizontalPadding).toFloat()
        val chartBottom = barAreaHeight.toFloat()

        val usableWidth = chartRight - chartLeft
        val gap = when {
            compactMode -> dp(context, 4f).toFloat()
            safeWidth < dp(context, 200f) -> dp(context, 5f).toFloat()
            else -> dp(context, 8f).toFloat()
        }

        val barWidth = ((usableWidth - gap * (totalBars - 1)) / totalBars)
            .coerceAtLeast(if (compactMode) dp(context, 8f).toFloat() else dp(context, 12f).toFloat())

        val minBarHeight = if (compactMode) dp(context, 6f).toFloat() else dp(context, 10f).toFloat()
        val maxBarHeight = (barAreaHeight - topPadding).coerceAtLeast(minBarHeight.toInt()).toFloat()

        val maxValue = bars.maxOrNull() ?: 0

        val barPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL
        }

        val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = textColor
            textAlign = Paint.Align.CENTER
            textSize = if (compactMode) sp(context, 10f) else sp(context, 12f)
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
        }

        for (i in 0 until totalBars) {
            val value = bars.getOrNull(i) ?: 0

            val height = if (value <= 0 || maxValue <= 0) {
                minBarHeight
            } else {
                minBarHeight + ((value.toFloat() / maxValue.toFloat()) * (maxBarHeight - minBarHeight))
            }

            val left = chartLeft + i * (barWidth + gap)
            val right = left + barWidth
            val top = chartBottom - height
            val bottom = chartBottom

            barPaint.color = when {
                i == totalBars - 1 -> accentColor
                value > 0 -> mainColor
                else -> mutedColor
            }

            val radius = min(barWidth / 2f, if (compactMode) dp(context, 5f).toFloat() else dp(context, 8f).toFloat())
            val rect = RectF(left, top, right, bottom)
            canvas.drawRoundRect(rect, radius, radius, barPaint)

            if (showWeekdayLabels) {
                val label = weekdayLabels.getOrNull(i).orEmpty()
                val labelX = rect.centerX()
                val labelY = safeHeight - dp(context, 6f).toFloat()
                canvas.drawText(label, labelX, labelY, textPaint)
            }
        }

        return bitmap
    }

    private fun dp(context: Context, value: Float): Int {
        return (value * context.resources.displayMetrics.density).toInt()
    }

    private fun sp(context: Context, value: Float): Float {
      return value * context.resources.configuration.fontScale * context.resources.displayMetrics.density
    }
}
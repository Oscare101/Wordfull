package com.wordfull.widgets

import android.content.Context
import android.graphics.*
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
    ): Bitmap {
        val safeWidth = max(widthPx, dp(context, 240f))
        val safeHeight = max(heightPx, dp(context, 90f))

        val bitmap = Bitmap.createBitmap(safeWidth, safeHeight, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)

        val barAreaHeight = (safeHeight * 0.72f).toInt()
        val labelsAreaHeight = safeHeight - barAreaHeight

        val chartLeft = dp(context, 4f).toFloat()
        val chartRight = (safeWidth - dp(context, 4f)).toFloat()
        val chartBottom = barAreaHeight.toFloat()

        val totalBars = 7
        val gap = dp(context, 8f).toFloat()
        val usableWidth = chartRight - chartLeft
        val barWidth = ((usableWidth - gap * (totalBars - 1)) / totalBars).coerceAtLeast(dp(context, 14f).toFloat())

        val minBarHeight = dp(context, 10f).toFloat()
        val maxBarHeight = (barAreaHeight - dp(context, 8f)).toFloat()

        val maxValue = bars.maxOrNull() ?: 0

        val barPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL
        }

        val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = textColor
            textAlign = Paint.Align.CENTER
            textSize = sp(context, 14f)
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

            val radius = min(barWidth / 2f, dp(context, 8f).toFloat())
            val rect = RectF(left, top, right, bottom)
            canvas.drawRoundRect(rect, radius, radius, barPaint)

            val label = weekdayLabels.getOrNull(i).orEmpty()
            val labelX = rect.centerX()
            val labelY = barAreaHeight + labelsAreaHeight * 0.72f

            canvas.drawText(label, labelX, labelY, textPaint)
        }

        return bitmap
    }

    private fun dp(context: Context, value: Float): Int {
        return (value * context.resources.displayMetrics.density).toInt()
    }

    private fun sp(context: Context, value: Float): Float {
        return value * context.resources.displayMetrics.scaledDensity
    }
}
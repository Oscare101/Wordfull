package com.wordfull.widgets

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class HistoryWidgetModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "HistoryWidgetModule"

    @ReactMethod
    fun updateTheme(
        bgColor: String,
        textColor: String,
        barMainColor: String,
        barAccentColor: String,
        barMutedColor: String
    ) {
        HistoryWidgetUpdater.saveTheme(
            reactContext,
            bgColor,
            textColor,
            barMainColor,
            barAccentColor,
            barMutedColor
        )

        HistoryWidgetUpdater.refreshAllWidgets(reactContext)
    }
}
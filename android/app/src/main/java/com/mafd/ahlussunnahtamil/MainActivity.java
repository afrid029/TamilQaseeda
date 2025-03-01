package com.mafd.ahlussunnahtamil;

import android.content.Intent;
import android.os.Bundle;

import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Start the foreground service
    Intent serviceIntent = new Intent(this, BackgroundAudioService.class);
//    startService(serviceIntent)
    ContextCompat.startForegroundService(this, serviceIntent);
  }
}

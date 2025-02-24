package com.mafd.ahlussunnahtamil;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

public class BackgroundAudioService extends Service {
  private static final String CHANNEL_ID = "BackgroundAudioChannel";

  @Override
  public void onCreate() {
    super.onCreate();

    // Create notification channel for devices running Android Oreo and above
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel channel = new NotificationChannel(
        CHANNEL_ID,
        "Background Audio",
        NotificationManager.IMPORTANCE_DEFAULT
      );
      NotificationManager notificationManager = getSystemService(NotificationManager.class);
      notificationManager.createNotificationChannel(channel);
    }

    // Create and start a persistent notification for the foreground service
    Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle("Ahlussunnah Tamil Radio")
      .setContentText("Streaming")
      .setSmallIcon(R.drawable.ic_music_note)  // Your app's music note icon
      .build();

    startForeground(1, notification);  // Start the service in the foreground with a persistent notification
  }

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    // Add your audio playing code here (e.g., start the audio playback)
    // For example, trigger Howler.js or any native audio service.

    return START_STICKY;  // Ensure the service keeps running
  }

  @Nullable
  @Override
  public IBinder onBind(Intent intent) {
    return null;  // We don't need to bind the service
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    // Handle cleanup if needed
    stopForeground(true);  // This removes the notification
    stopSelf();  // Stop the service
  }
}

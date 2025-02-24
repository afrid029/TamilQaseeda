package com.mafd.ahlussunnahtamil;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.os.Bundle;

public class MyApplication extends Application {
  @Override
  public void onCreate() {
    super.onCreate();
    // Register activity lifecycle callbacks
    registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks() {
      @Override
      public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
      }

      @Override
      public void onActivityStarted(Activity activity) {
      }

      @Override
      public void onActivityResumed(Activity activity) {
        // Activity is in the foreground
      }

      @Override
      public void onActivityPaused(Activity activity) {
        // Activity is going to the background
      }

      @Override
      public void onActivityStopped(Activity activity) {
      }

      @Override
      public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
      }

      @Override
      public void onActivityDestroyed(Activity activity) {

        Intent serviceIntent = new Intent(getApplicationContext(), BackgroundAudioService.class);

        stopService(serviceIntent);
        // Called when an activity is destroyed (if killed or removed from recent)
        // Here, you can stop your service or do any necessary cleanup
        // Check if the app has been removed from the recent apps
      }
    });
  }
}

package com.mafd.ahlussunnahtamil;

import android.content.Intent;
import android.os.Bundle;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;
import com.google.android.gms.tasks.Task;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.appupdate.AppUpdateOptions;
import com.google.android.play.core.install.InstallStateUpdatedListener;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.InstallStatus;
import com.google.android.play.core.install.model.UpdateAvailability;

public class MainActivity extends BridgeActivity {
  private ActivityResultLauncher activityResultLauncher;
  private AppUpdateManager appUpdateManager;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Start the foreground service
    Intent serviceIntent = new Intent(this, BackgroundAudioService.class);
//    startService(serviceIntent)
    ContextCompat.startForegroundService(this, serviceIntent);

    checkForInAppUpdate();
  }

  private void checkForInAppUpdate() {
    appUpdateManager = AppUpdateManagerFactory.create(getApplicationContext());
    appUpdateManager.registerListener(listener);

// Returns an intent object that you use to check for an update.
    Task<AppUpdateInfo> appUpdateInfoTask = appUpdateManager.getAppUpdateInfo();

// Checks that the platform will allow the specified type of update.
    appUpdateInfoTask.addOnSuccessListener(appUpdateInfo -> {
      if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
        // This example applies an immediate update. To apply a flexible update
        // instead, pass in AppUpdateType.FLEXIBLE
        && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {
        // Request the update.
        appUpdateManager.startUpdateFlowForResult(
          // Pass the intent that is returned by 'getAppUpdateInfo()'.
          appUpdateInfo,
          // an activity result launcher registered via registerForActivityResult
          activityResultLauncher,
          // Or pass 'AppUpdateType.FLEXIBLE' to newBuilder() for
          // flexible updates.
          AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build());
      }
    });

    activityResultLauncher = registerForActivityResult(
      new ActivityResultContracts.StartIntentSenderForResult(),
      new ActivityResultCallback<ActivityResult>() {
        @Override
        public void onActivityResult(ActivityResult result) {
          // handle callback
          if (result.getResultCode() != RESULT_OK) {
            //log("Update flow failed! Result code: " + result.getResultCode());
            // If the update is canceled or fails,
            // you can request to start the update again.
          }
        }
      });


  }

  InstallStateUpdatedListener listener = state -> {
    if (state.installStatus() == InstallStatus.DOWNLOADED) {
      // After the update is downloaded, show a notification
      // and request user confirmation to restart the app.
      popupSnackbarForCompleteUpdate();
    }

  };

  private void popupSnackbarForCompleteUpdate() {
    Snackbar snackbar =
      Snackbar.make(
        findViewById(R.id.container),
        "An update has just been downloaded.",
        Snackbar.LENGTH_INDEFINITE);
    snackbar.setAction("RESTART", view -> appUpdateManager.completeUpdate());
    snackbar.setActionTextColor(
      ContextCompat.getColor(getApplicationContext(),android.R.color.holo_blue_dark));
    snackbar.show();
  }

  @Override
  public void onStop() {
    super.onStop();
    appUpdateManager.unregisterListener(listener);
  }

  @Override
  public void onResume() {
    super.onResume();

    appUpdateManager
      .getAppUpdateInfo()
      .addOnSuccessListener(appUpdateInfo -> {
        // If the update is downloaded but not installed,
        // notify the user to complete the update.
        if (appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED) {
          popupSnackbarForCompleteUpdate();
        }
      });
  }
}

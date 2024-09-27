package com.akvilonmobile;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MainActivity extends ReactActivity {
    public final String TAG = this.getClass().getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, true);  // here
        super.onCreate(savedInstanceState);
        printKeyHash();
    }

    private void printKeyHash() {
        try {
            PackageInfo info = getPackageManager()
                    .getPackageInfo("com.akvilonmobile",
                            PackageManager.GET_SIGNATURES);
            for (Signature signature:info.signatures) {
                MessageDigest md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());
                Log.d(TAG, "KeyHash: " + Base64.encodeToString(md.digest(),Base64.DEFAULT));
            }
        } catch (PackageManager.NameNotFoundException | NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "akvilonmobile";
  }
}

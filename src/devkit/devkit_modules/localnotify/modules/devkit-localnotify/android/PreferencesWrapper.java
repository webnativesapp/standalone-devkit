package com.tealeaf.plugin.plugins;

import java.lang.reflect.Method;
import java.lang.Class;
import android.content.SharedPreferences;


// To be compatible with API level 8, we need to separate out the apply function
public class PreferencesWrapper {
	private static Method _method = null;

	static {
		try {
			Class edclass = Class.forName("android.content.SharedPreferences.Editor");
			_method = edclass.getMethod("apply");
		} catch (Exception ex) {
		}
	}

	public static boolean runApply(SharedPreferences.Editor editor) {
		try {
			_method.invoke(editor);
		} catch (Exception e) {
			return false;
		}

		return true;
	}
}


import {gotoAppPermissionSetting} from "./wa-permission/permission.js"
export default function allFilePermission() {
   // 导入所需的Android类
   const Build = plus.android.importClass("android.os.Build");
   const activity = plus.android.runtimeMainActivity();
   // Android 11(Api 30) 或更高版本的写文件权限需要特殊申请， 需要动态申请管理所有文件的权限
   if (Build.VERSION.SDK >= Build.VERSION_CODES.R) {
       const Environment = plus.android.importClass("android.os.Environment");
       // 判断是否已授权
       if (!Environment.isExternalStorageManager()) {
           const Settings = plus.android.importClass("android.provider.Settings");
           const Uri = plus.android.importClass("android.net.Uri");
           const Intent = plus.android.importClass("android.content.Intent");
           const appIntent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
           const packageName = plus.android.invoke(activity, "getPackageName");
           appIntent.setData(Uri.parse("package:" + packageName));
           try {
               plus.android.invoke(activity, "startActivity", appIntent);
           } catch (error) {
               uni.showToast({
                   title: '拉起授权失败',
                   icon: "none"
               });
           }
           plus.android.autoCollection(appIntent);
       }
   } else {
       // 小于安卓SDK30则拉取应用权限界面
       const PackageManager = plus.android.importClass("android.content.pm.PackageManager");
       const result = plus.android.invoke(activity, "checkSelfPermission",
           "android.permission.WRITE_EXTERNAL_STORAGE");
       // 判断是否已授权
       if (result === PackageManager.PERMISSION_DENIED) {
           gotoAppPermissionSetting(); // 如果未授权，则跳转到权限设置界面
       }
   }
}
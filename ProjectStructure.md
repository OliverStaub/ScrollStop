# Project Structure for /Users/oliverstaub/gitroot/ScrollStop

- **.git/**
- **iOS (App)/**
  - **Base.lproj/**
    - LaunchScreen.storyboard (2496 bytes)
      - Content preview:
```
<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="19085" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" useTraitCollections="YES" useSafeAreas="YES" colorMatched="YES" initialViewController="01J-lp-oVM">
    <dependencies>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="19082"/>
        <capability name="Image references" minToolsVersion="12.0"/>
        <capability name="Safe area layout guides" minToolsVersion="9.0"/>
        <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
    </dependencies>
    <scenes>
        <!--View Controller-->
        <scene sceneID="EHf-IW-A2E">
            <objects>
                <viewController id="01J-lp-oVM" sceneMemberID="viewController">
                    <view key="[REDACTED]" contentMode="scaleToFill" id="Ze5-6b-2t3">
                        <rect key="[REDACTED]" x="0.0" y="0.0" width="414" height="896"/>
                        <autoresizingMask key="[REDACTED]" widthSizable="YES" heightSizable="YES"/>
                        <subviews>
                            <imageView clipsSubviews="YES" userInteractionEnabled="NO" contentMode="scaleToFill" horizontalHuggingPriority="251" verticalHuggingPriority="251" fixedFrame="YES" translatesAutoresizingMaskIntoConstraints="NO" id="6HG-Um-bch">
                                <rect key="[REDACTED]" x="142" y="385" width="128" height="128"/>
                                <autoresizingMask key="[REDACTED]" flexibleMinX="YES" flexibleMaxX="YES" flexibleMinY="YES" flexibleMaxY="YES"/>
                                <imageReference key="[REDACTED]" image="LargeIcon"/>
                            </imageView>
                        </subviews>
                        <viewLayoutGuide key="[REDACTED]" id="6Tk-OE-BBY"/>
                        <color key="[REDACTED]" xcode11CocoaTouchSystemColor="systemBackgroundColor" cocoaTouchSystemColor="whiteColor"/>
                    </view>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="iYj-Kq-Ea1" userLabel="First Responder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="[REDACTED]" x="53" y="375"/>
        </scene>
    </scenes>
    <resources>
        <image name="LargeIcon" width="128" height="128"/>
    </resources>
</document>

```
    - Main.storyboard (2536 bytes)
      - Content preview:
```
<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="18122" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" useTraitCollections="YES" useSafeAreas="YES" colorMatched="YES" initialViewController="BYZ-38-t0r">
    <device id="retina6_1" orientation="portrait" appearance="light"/>
    <dependencies>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="18093"/>
        <capability name="Safe area layout guides" minToolsVersion="9.0"/>
        <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
    </dependencies>
    <scenes>
        <!--View Controller-->
        <scene sceneID="tne-QT-ifu">
            <objects>
                <viewController id="BYZ-38-t0r" customClass="ViewController" customModuleProvider="target" sceneMemberID="viewController">
                    <view key="[REDACTED]" contentMode="scaleToFill" id="8bC-Xf-vdC">
                        <rect key="[REDACTED]" x="0.0" y="0.0" width="414" height="896"/>
                        <autoresizingMask key="[REDACTED]" widthSizable="YES" heightSizable="YES"/>
                        <subviews>
                            <wkWebView contentMode="scaleToFill" fixedFrame="YES" translatesAutoresizingMaskIntoConstraints="NO" id="RDB-ib-igF">
                                <rect key="[REDACTED]" x="0.0" y="0.0" width="414" height="896"/>
                                <autoresizingMask key="[REDACTED]" widthSizable="YES" heightSizable="YES"/>
                                <wkWebViewConfiguration key="[REDACTED]">
                                    <audiovisualMediaTypes key="[REDACTED]" none="YES"/>
                                    <wkPreferences key="[REDACTED]"/>
                                </wkWebViewConfiguration>
                            </wkWebView>
                        </subviews>
                        <viewLayoutGuide key="[REDACTED]" id="6Tk-OE-BBY"/>
                    </view>
                    <connections>
                        <outlet property="webView" destination="RDB-ib-igF" id="avx-RC-qRB"/>
                    </connections>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="dkx-z0-nzr" sceneMemberID="firstResponder"/>
            </objects>
            <point key="[REDACTED]" x="53" y="375"/>
        </scene>
    </scenes>
</document>

```
  - AppDelegate.swift (734 bytes)
    - Content preview:
```
//
//  AppDelegate.swift
//  iOS (App)
//
//  Created by Oliver Staub on 19.05.2025.
//

import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        return true
    }

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

}

```
  - Info.plist (704 bytes)
    - Content preview:
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>UIApplicationSceneManifest</key>
	<dict>
		<key>UIApplicationSupportsMultipleScenes</key>
		<false/>
		<key>UISceneConfigurations</key>
		<dict>
			<key>UIWindowSceneSessionRoleApplication</key>
			<array>
				<dict>
					<key>UISceneConfigurationName</key>
					<string>Default Configuration</string>
					<key>UISceneDelegateClassName</key>
					<string>$(PRODUCT_MODULE_NAME).SceneDelegate</string>
					<key>UISceneStoryboardFile</key>
					<string>Main</string>
				</dict>
			</array>
		</dict>
	</dict>
</dict>
</plist>

```
  - SceneDelegate.swift (392 bytes)
    - Content preview:
```
//
//  SceneDelegate.swift
//  iOS (App)
//
//  Created by Oliver Staub on 19.05.2025.
//

import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let _ = (scene as? UIWindowScene) else { return }
    }

}

```
- **iOS (Extension)/**
  - Info.plist (631 bytes)
    - Content preview:
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
	<dict>
		<key>NSExtension</key>
		<dict>
			<key>NSExtensionPointIdentifier</key>
			<string>com.apple.Safari.web-extension</string>
			<key>NSExtensionPrincipalClass</key>
			<string>$(PRODUCT_MODULE_NAME).SafariWebExtensionHandler</string>
			<key>CFBundleShortVersionString</key>
			<string>1.0</string>
			<key>CFBundleVersion</key>
			<string>1</string>
			<key>NSHumanReadableCopyright</key>
			<string>© 2025 Oliver Staub</string>
		</dict>
	</dict>
</plist>
```
- **macOS (App)/**
  - **Base.lproj/**
    - Main.storyboard (8558 bytes)
      - Content preview:
```
<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.Cocoa.Storyboard.XIB" version="3.0" toolsVersion="23727" targetRuntime="MacOSX.Cocoa" propertyAccessControl="none" useAutolayout="YES" initialViewController="B8D-0N-5wS">
    <dependencies>
        <deployment identifier="macosx"/>
        <plugIn identifier="com.apple.InterfaceBuilder.CocoaPlugin" version="23727"/>
        <plugIn identifier="com.apple.WebKit2IBPlugin" version="23727"/>
        <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
    </dependencies>
    <scenes>
        <!--Application-->
        <scene sceneID="JPo-4y-FX3">
            <objects>
                <application id="hnw-xV-0zn" sceneMemberID="viewController">
                    <menu key="[REDACTED]" title="Main Menu" systemMenu="main" id="AYu-sK-qS6">
                        <items>
                            <menuItem title="ScrollStop" id="1Xt-HY-uBw">
                                <modifierMask key="[REDACTED]"/>
                                <menu key="[REDACTED]" title="ScrollStop" systemMenu="apple" id="uQy-DD-JDr">
                                    <items>
                                        <menuItem title="About ScrollStop" id="5kV-Vb-QxS">
                                            <modifierMask key="[REDACTED]"/>
                                            <connections>
                                                <action selector="orderFrontStandardAboutPanel:" target="Ady-hI-5gd" id="Exp-CZ-Vem"/>
                                            </connections>
                                        </menuItem>
                                        <menuItem isSeparatorItem="YES" id="VOq-y0-SEH"/>
                                        <menuItem title="Hide ScrollStop" keyEquivalent="[REDACTED]" id="Olw-nP-bQN">
                                            <connections>
                                                <action selector="hide:" target="Ady-hI-5gd" id="PnN-Uc-m68"/>
                                            </connections>
                                        </menuItem>
                                        <menuItem title="Hide Others" keyEquivalent="[REDACTED]" id="Vdr-fp-XzO">
                                            <modifierMask key="[REDACTED]" option="YES" command="YES"/>
                                            <connections>
                                                <action selector="hideOtherApplications:" target="Ady-hI-5gd" id="VT4-aY-XCT"/>
                                            </connections>
                                        </menuItem>
                                        <menuItem title="Show All" id="Kd2-mp-pUS">
                                            <modifierMask key="[REDACTED]"/>
                                            <connections>
                                                <action selector="unhideAllApplications:" target="Ady-hI-5gd" id="Dhg-Le-xox"/>
                                            </connections>
                                        </menuItem>
                                        <menuItem isSeparatorItem="YES" id="kCx-OE-vgT"/>
                                        <menuItem title="Quit ScrollStop" keyEquivalent="[REDACTED]" id="4sb-4s-VLi">
                                            <connections>
                                                <action selector="terminate:" target="Ady-hI-5gd" id="Te7-pn-YzF"/>
                                            </connections>
                                        </menuItem>
                                    </items>
                                </menu>
                            </menuItem>
                            <menuItem title="Help" id="wpr-3q-Mcd">
                                <modifierMask key="[REDACTED]"/>
                                <menu key="[REDACTED]" title="Help" systemMenu="help" id="F2S-fz-NVQ">
                                    <items>
                                        <menuItem title="ScrollStop Help" keyEquivalent="[REDACTED]" id="FKE-Sm-Kum">
                                            <connections>
                                                <action selector="showHelp:" target="Ady-hI-5gd" id="y7X-2Q-9no"/>
                                            </connections>
                                        </menuItem>
                                    </items>
                                </menu>
                            </menuItem>
                        </items>
                    </menu>
                    <connections>
                        <outlet property="delegate" destination="Voe-Tx-rLC" id="PrD-fu-P6m"/>
                    </connections>
                </application>
                <customObject id="Voe-Tx-rLC" customClass="AppDelegate" customModule="ScrollStop" customModuleProvider="target"/>
                <customObject id="YLy-65-1bz" customClass="NSFontManager"/>
                <customObject id="Ady-hI-5gd" userLabel="First Responder" customClass="NSResponder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="[REDACTED]" x="76" y="-134"/>
        </scene>
        <!--Window Controller-->
        <scene sceneID="R2V-B0-nI4">
            <objects>
                <windowController showSeguePresentationStyle="single" id="B8D-0N-5wS" sceneMemberID="viewController">
                    <window key="[REDACTED]" title="ScrollStop" allowsToolTipsWhenApplicationIsInactive="NO" autorecalculatesKeyViewLoop="[REDACTED]" restorable="NO" releasedWhenClosed="NO" animationBehavior="default" id="IQv-IB-iLA">
                        <windowStyleMask key="[REDACTED]" titled="YES" closable="YES"/>
                        <windowCollectionBehavior key="[REDACTED]" fullScreenNone="YES"/>
                        <rect key="[REDACTED]" x="196" y="240" width="600" height="600"/>
                        <rect key="[REDACTED]" x="0.0" y="0.0" width="1680" height="1027"/>
                        <value key="[REDACTED]" type="size" width="600" height="600"/>
                        <connections>
                            <outlet property="delegate" destination="B8D-0N-5wS" id="98r-iN-zZc"/>
                        </connections>
                    </window>
                    <connections>
                        <segue destination="XfG-lQ-9wD" kind="relationship" relationship="window.shadowedContentViewController" id="cq2-FE-JQM"/>
                    </connections>
                </windowController>
                <customObject id="Oky-zY-oP4" userLabel="First Responder" customClass="NSResponder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="[REDACTED]" x="75" y="250"/>
        </scene>
        <!--View Controller-->
        <scene sceneID="hIz-AP-VOD">
            <objects>
                <viewController id="XfG-lQ-9wD" customClass="ViewController" customModule="ScrollStop" customModuleProvider="target" sceneMemberID="viewController">
                    <view key="[REDACTED]" id="m2S-Jp-Qdl">
                        <rect key="[REDACTED]" x="0.0" y="0.0" width="425" height="325"/>
                        <autoresizingMask key="[REDACTED]"/>
                        <subviews>
                            <wkWebView wantsLayer="YES" fixedFrame="YES" translatesAutoresizingMaskIntoConstraints="NO" id="eOr-cG-IQY">
                                <rect key="[REDACTED]" x="0.0" y="0.0" width="425" height="325"/>
                                <autoresizingMask key="[REDACTED]" widthSizable="YES" heightSizable="YES"/>
                                <wkWebViewConfiguration key="[REDACTED]">
                                    <audiovisualMediaTypes key="[REDACTED]" none="YES"/>
                                    <wkPreferences key="[REDACTED]"/>
                                </wkWebViewConfiguration>
                            </wkWebView>
                        </subviews>
                    </view>
                    <connections>
                        <outlet property="webView" destination="eOr-cG-IQY" id="GFe-mU-dBY"/>
                    </connections>
                </viewController>
                <customObject id="rPt-NT-nkU" userLabel="First Responder" customClass="NSResponder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="[REDACTED]" x="75" y="655"/>
        </scene>
    </scenes>
</document>

```
  - AppDelegate.swift (434 bytes)
    - Content preview:
```
//
//  AppDelegate.swift
//  macOS (App)
//
//  Created by Oliver Staub on 19.05.2025.
//

import Cocoa

@main
class AppDelegate: NSObject, NSApplicationDelegate {

    func applicationDidFinishLaunching(_ notification: Notification) {
        // Override point for customization after application launch.
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }

}

```
  - ScrollStop.entitlements (365 bytes)
    - Content preview:
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>com.apple.security.app-sandbox</key>
	<true/>
	<key>com.apple.security.files.user-selected.read-only</key>
	<true/>
	<key>com.apple.security.network.client</key>
	<true/>
</dict>
</plist>

```
- **macOS (Extension)/**
  - Info.plist (631 bytes)
    - Content preview:
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
	<dict>
		<key>NSExtension</key>
		<dict>
			<key>NSExtensionPointIdentifier</key>
			<string>com.apple.Safari.web-extension</string>
			<key>NSExtensionPrincipalClass</key>
			<string>$(PRODUCT_MODULE_NAME).SafariWebExtensionHandler</string>
			<key>CFBundleShortVersionString</key>
			<string>1.0</string>
			<key>CFBundleVersion</key>
			<string>1</string>
			<key>NSHumanReadableCopyright</key>
			<string>© 2025 Oliver Staub</string>
		</dict>
	</dict>
</plist>
```
  - ScrollStop.entitlements (322 bytes)
    - Content preview:
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
    <key>com.apple.security.files.user-selected.read-only</key>
    <true/>
</dict>
</plist>

```
- **ScrollStop.xcodeproj/**
  - **project.xcworkspace/**
    - **xcshareddata/**
      - **swiftpm/**
        - **configuration/**
    - **xcuserdata/**
    - contents.xcworkspacedata (135 bytes)
      - Content preview:
```
<?xml version="1.0" encoding="UTF-8"?>
<Workspace
   version = "1.0">
   <FileRef
      location = "self:">
   </FileRef>
</Workspace>

```
  - **xcuserdata/**
  - project.pbxproj (32747 bytes)
    - Content preview:
```
// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 77;
	objects = {

/* Begin PBXBuildFile section */
		3DBE1C822DDB8900007A7E2A /* ScrollStop Extension.appex in Embed Foundation Extensions */ = {isa = PBXBuildFile; fileRef = 3DBE1C812DDB8900007A7E2A /* ScrollStop Extension.appex */; settings = {ATTRIBUTES = (RemoveHeadersOnCopy, ); }; };
		3DBE1C8C2DDB8900007A7E2A /* ScrollStop Extension.appex in Embed Foundation Extensions */ = {isa = PBXBuildFile; fileRef = 3DBE1C8B2DDB8900007A7E2A /* ScrollStop Extension.appex */; settings = {ATTRIBUTES = (RemoveHeadersOnCopy, ); }; };
/* End PBXBuildFile section */

/* Begin PBXContainerItemProxy section */
		3DBE1C832DDB8900007A7E2A /* PBXContainerItemProxy */ = {
			isa = PBXContainerItemProxy;
			containerPortal = 3DBE1C472DDB88FF007A7E2A /* Project object */;
			proxyType = 1;
			remoteGlobalIDString = 3DBE1C802DDB8900007A7E2A;
			remoteInfo = "ScrollStop Extension (iOS)";
		};
		3DBE1C8D2DDB8900007A7E2A /* PBXContainerItemProxy */ = {
			isa = PBXContainerItemProxy;
			containerPortal = 3DBE1C472DDB88FF007A7E2A /* Project object */;
			proxyType = 1;
			remoteGlobalIDString = 3DBE1C8A2DDB8900007A7E2A;
			remoteInfo = "ScrollStop Extension (macOS)";
		};
/* End PBXContainerItemProxy section */

/* Begin PBXCopyFilesBuildPhase section */
		3DBE1CB52DDB8900007A7E2A /* Embed Foundation Extensions */ = {
			isa = PBXCopyFilesBuildPhase;
			buildActionMask = 2147483647;
			dstPath = "";
			dstSubfolderSpec = 13;
			files = (
				3DBE1C822DDB8900007A7E2A /* ScrollStop Extension.appex in Embed Foundation Extensions */,
			);
			name = "Embed Foundation Extensions";
			runOnlyForDeploymentPostprocessing = 0;
		};
		3DBE1CBF2DDB8900007A7E2A /* Embed Foundation Extensions */ = {
			isa = PBXCopyFilesBuildPhase;
			buildActionMask = 2147483647;
			dstPath = "";
			dstSubfolderSpec = 13;
			files = (
				3DBE1C8C2DDB8900007A7E2A /* ScrollStop Extension.appex in Embed Foundation Extensions */,
			);
			name = "Embed Foundation Extensions";
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXCopyFilesBuildPhase section */

/* Begin PBXFileReference section */
		3DBE1C632DDB8900007A7E2A /* ScrollStop.app */ = {isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = ScrollStop.app; sourceTree = BUILT_PRODUCTS_DIR; };
		3DBE1C752DDB8900007A7E2A /* ScrollStop.app */ = {isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = ScrollStop.app; sourceTree = BUILT_PRODUCTS_DIR; };
		3DBE1C812DDB8900007A7E2A /* ScrollStop Extension.appex */ = {isa = PBXFileReference; explicitFileType = "wrapper.app-extension"; includeInIndex = 0; path = "ScrollStop Extension.appex"; sourceTree = BUILT_PRODUCTS_DIR; };
		3DBE1C8B2DDB8900007A7E2A /* ScrollStop Extension.appex */ = {isa = PBXFileReference; explicitFileType = "wrapper.app-extension"; includeInIndex = 0; path = "ScrollStop Extension.appex"; sourceTree = BUILT_PRODUCTS_DIR; };
/* End PBXFileReference section */

/* Begin PBXFileSystemSynchronizedBuildFileExceptionSet section */
		3DBE1CB02DDB8900007A7E2A /* Exceptions for "Shared (App)" folder in "ScrollStop (iOS)" target */ = {
			isa = PBXFileSystemSynchronizedBuildFileExceptionSet;
			membershipExceptions = (
				"/Localized: Resources/Main.html",
				Assets.xcassets,
				Resources/Icon.png,
				Resources/Script.js,
				Resources/Style.css,
				ViewController.swift,
			);
			target = 3DBE1C622DDB8900007A7E2A /* ScrollStop (iOS) */;
		};
		3DBE1CB42DDB8900007A7E2A /* Exceptions for "iOS (Extension)" folder in "ScrollStop Extension (iOS)" target */ = {
			isa = PBXFileSystemSynchronizedBuildFileExceptionSet;
			membershipExceptions = (
				Info.plist,
			);
			target = 3DBE1C802DDB8900007A7E2A /* ScrollStop Extension (iOS) */;
		};
		3DBE1CB92DDB8900007A7E2A /* Exceptions for "iOS (App)" folder in "ScrollStop (iOS)" target */ = {
			isa = PBXFileSystemSynchronizedBuildFileExceptionSet;
			membershipExceptions = (
				Info.plist,
			);
			target = 3DBE1C622DDB8900007A7E2A /* ScrollStop (iOS) */;
		};
		3DBE1CBA2DDB8900007A7E2A /* Exceptions for "Shared (App)" folder in "ScrollStop (macOS)" target */ = {
			isa = PBXFileSystemSynchronizedBuildFileExceptionSet;
			membershipExceptions = (
				"/Localized: Resources/Main.html",
				Assets.xcassets,
				Resources/Icon.png,
				Resources/Script.js,
				Resources/Style.css,
				ViewController.swift,
			);
			target = 3DBE1C742DDB8900007A7E2A /* ScrollStop (macOS) */;
		};
		3DBE1CBE2DDB8900007A7E2A /* Exceptions for "macOS (Extension)" folder in "ScrollStop Extension (macOS)" target */ = {
			isa = PBXFileSystemSynchronizedBuildFileExceptionSet;
			membershipExceptions = (
				Info.plist,
			);
			target = 3DBE1C8A2DDB8900007A7E2A /* ScrollStop Extension (macOS) */;
		};
		3DBE1CC32DDB8900007A7E2A /* Exceptions for "Shared (Extension)" folder in "ScrollStop Extension (iOS)" target */ = {
			isa = PBXFileSystemSynchronizedBuildFileExceptionSet;
			membershipExceptions = (
				Resources/_locales,
				Resources/background.js,
				Resources/content.js,
				Resources/images,
				Resources/manifest.json,
				"Resources/modules/blocking-screen/blocking-screen.css",
				"Resources/modules/blocking-screen/blocking-screen.js",
				"Resources/modules/doomscroll-detector/doomscroll-animation.css",
				"Resources/modules/doomscroll-detector/doomscroll-animation.js",
				"Resources/modules/doomscroll-detector/doomscroll-detector.js",
				"Resources/modules/transition-screen/transition-screen.css",
				"Resources/modules/transition-screen/transition-screen.js",
				"Resources/modules/utils/storage-helper.js",
				"Resources/modules/utils/time-manager.js",
				Resources/popup.html,
				Resources/sites.json,
				SafariWebExtensionHandler.swift,
			);
			target = 3DBE1C802DDB8900007A7E2A /* ScrollStop Extension (iOS) */;
		};
		3DBE1CC42DDB8900007A7E2A /* Exceptions for "Shared (Extension)" folder in "ScrollStop Extension (macOS)" target */ = {
			isa = PBXFileSystemSynchronizedBuildFileExceptionSet;
			membershipExceptions = (
				Resources/_locales,
				Resources/background.js,
				Resources/content.js,
				Resources/images,
				Resources/manifest.json,
				"Resources/modules/blocking-screen/blocking-screen.css",
				"Resources/modules/blocking-screen/blocking-screen.js",
				"Resources/modules/doomscroll-detector/doomscroll-animation.css",
				"Resources/modules/doomscroll-detector/doomscroll-animation.js",
				"Resources/modules/doomscroll-detector/doomscroll-detector.js",
				"Resources/modules/transition-screen/transition-screen.css",
				"Resources/modules/transition-screen/transition-screen.js",
				"Resources/modules/utils/storage-helper.js",
				"Resources/modules/utils/time-manager.js",
				Resources/popup.html,
				Resources/sites.json,
				SafariWebExtensionHandler.swift,
			);
			target = 3DBE1C8A2DDB8900007A7E2A /* ScrollStop Extension (macOS) */;
		};
/* End PBXFileSystemSynchronizedBuildFileExceptionSet section */

/* Begin PBXFileSystemSynchronizedRootGroup section */
		3DBE1C4B2DDB88FF007A7E2A /* Shared (App) */ = {
			isa = PBXFileSystemSynchronizedRootGroup;
			exceptions = (
				3DBE1CB02DDB8900007A7E2A /* Exceptions for "Shared (App)" folder in "ScrollStop (iOS)" target */,
				3DBE1CBA2DDB8900007A7E2A /* Exceptions for "Shared (App)" folder in "ScrollStop (macOS)" target */,
			);
			path = "Shared (App)";
			sourceTree = "<group>";
		};
		3DBE1C542DDB8900007A7E2A /* Shared (Extension) */ = {
			isa = PBXFileSystemSynchronizedRootGroup;
			exceptions = (
				3DBE1CC32DDB8900007A7E2A /* Exceptions for "Shared (Extension)" folder in "ScrollStop Extension (iOS)" target */,
				3DBE1CC42DDB8900007A7E2A /* Exceptions for "Shared (Extension)" folder in "ScrollStop Extension (macOS)" target */,
			);
			explicitFolders = (
				Resources/_locales,
				Resources/images,
			);
			path = "Shared (Extension)";
			sourceTree = "<group>";
		};
		3DBE1C652DDB8900007A7E2A /* iOS (App) */ = {
			isa = PBXFileSystemSynchronizedRootGroup;
			exceptions = (
				3DBE1CB92DDB8900007A7E2A /* Exceptions for "iOS (App)" folder in "ScrollStop (iOS)" target */,
			);
			path = "iOS (App)";
			sourceTree = "<group>";
		};
		3DBE1C762DDB8900007A7E2A /* macOS (App) */ = {
			isa = PBXFileSystemSynchronizedRootGroup;
			path = "macOS (App)";
			sourceTree = "<group>";
		};
		3DBE1C852DDB8900007A7E2A /* iOS (Extension) */ = {
			isa = PBXFileSystemSynchronizedRootGroup;
			exceptions = (
				3DBE1CB42DDB8900007A7E2A /* Exceptions for "iOS (Extension)" folder in "ScrollStop Extension (iOS)" target */,
			);
			path = "iOS (Extension)";
			sourceTree = "<group>";
		};
		3DBE1C8F2DDB8900007A7E2A /* macOS (Extension) */ = {
			isa = PBXFileSystemSynchronizedRootGroup;
			exceptions = (
				3DBE1CBE2DDB8900007A7E2A /* Exceptions for "macOS (Extension)" folder in "ScrollStop Extension (macOS)" target */,
			);
			path = "macOS (Extension)";
			sourceTree = "<group>";
		};
/* End PBXFileSystemSynchronizedRootGroup section */

/* Begin PBXFrameworksBuildPhase section */
		3DBE1C602DDB8900007A7E2A /* Frameworks */ = {
			isa = PBXFrameworksBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
		3DBE1C722DDB8900007A7E2A /* Frameworks */ = {
			isa = PBXFrameworksBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
		3DBE1C7E2DDB8900007A7E2A /* Frameworks */ = {
			isa = PBXFrameworksBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
		3DBE1C882DDB8900007A7E2A /* Frameworks */ = {
			isa = PBXFrameworksBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXFrameworksBuildPhase section */

/* Begin PBXGroup section */
		3DBE1C462DDB88FF007A7E2A = {
			isa = PBXGroup;
			children = (
				3DBE1C4B2DDB88FF007A7E2A /* Shared (App) */,
				3DBE1C542DDB8900007A7E2A /* Shared (Extension) */,
				3DBE1C652DDB8900007A7E2A /* iOS (App) */,
				3DBE1C762DDB8900007A7E2A /* macOS (App) */,
				3DBE1C852DDB8900007A7E2A /* iOS (Extension) */,
				3DBE1C8F2DDB8900007A7E2A /* macOS (Extension) */,
				3DBE1C642DDB8900007A7E2A /* Products */,
			);
			sourceTree = "<group>";
		};
		3DBE1C642DDB8900007A7E2A /* Products */ = {
			isa = PBXGroup;
			children = (
				3DBE1C632DDB8900007A7E2A /* ScrollStop.app */,
				3DBE1C752DDB8900007A7E2A /* ScrollStop.app */,
				3DBE1C812DDB8900007A7E2A /* ScrollStop Extension.appex */,
				3DBE1C8B2DDB8900007A7E2A /* ScrollStop Extension.appex */,
			);
			name = Products;
			sourceTree = "<group>";
		};
/* End PBXGroup section */

/* Begin PBXNativeTarget section */
		3DBE1C622DDB8900007A7E2A /* ScrollStop (iOS) */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = 3DBE1CB62DDB8900007A7E2A /* Build configuration list for PBXNativeTarget "ScrollStop (iOS)" */;
			buildPhases = (
				3DBE1C5F2DDB8900007A7E2A /* Sources */,
				3DBE1C602DDB8900007A7E2A /* Frameworks */,
				3DBE1C612DDB8900007A7E2A /* Resources */,
				3DBE1CB52DDB8900007A7E2A /* Embed Foundation Extensions */,
			);
			buildRules = (
			);
			dependencies = (
				3DBE1C842DDB8900007A7E2A /* PBXTargetDependency */,
			);
			fileSystemSynchronizedGroups = (
				3DBE1C652DDB8900007A7E2A /* iOS (App) */,
			);
			name = "ScrollStop (iOS)";
			packageProductDependencies = (
			);
			productName = "ScrollStop (iOS)";
			productReference = 3DBE1C632DDB8900007A7E2A /* ScrollStop.app */;
			productType = "com.apple.product-type.application";
		};
		3DBE1C742DDB8900007A7E2A /* ScrollStop (macOS) */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = 3DBE1CC02DDB8900007A7E2A /* Build configuration list for PBXNativeTarget "ScrollStop (macOS)" */;
			buildPhases = (
				3DBE1C712DDB8900007A7E2A /* Sources */,
				3DBE1C722DDB8900007A7E2A /* Frameworks */,
				3DBE1C732DDB8900007A7E2A /* Resources */,
				3DBE1CBF2DDB8900007A7E2A /* Embed Foundation Extensions */,
			);
			buildRules = (
			);
			dependencies = (
				3DBE1C8E2DDB8900007A7E2A /* PBXTargetDependency */,
			);
			fileSystemSynchronizedGroups = (
				3DBE1C762DDB8900007A7E2A /* macOS (App) */,
			);
			name = "ScrollStop (macOS)";
			packageProductDependencies = (
			);
			productName = "ScrollStop (macOS)";
			productReference = 3DBE1C752DDB8900007A7E2A /* ScrollStop.app */;
			productType = "com.apple.product-type.application";
		};
		3DBE1C802DDB8900007A7E2A /* ScrollStop Extension (iOS) */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = 3DBE1CB12DDB8900007A7E2A /* Build configuration list for PBXNativeTarget "ScrollStop Extension (iOS)" */;
			buildPhases = (
				3DBE1C7D2DDB8900007A7E2A /* Sources */,
				3DBE1C7E2DDB8900007A7E2A /* Frameworks */,
				3DBE1C7F2DDB8900007A7E2A /* Resources */,
			);
			buildRules = (
			);
			dependencies = (
			);
			fileSystemSynchronizedGroups = (
				3DBE1C852DDB8900007A7E2A /* iOS (Extension) */,
			);
			name = "ScrollStop Extension (iOS)";
			packageProductDependencies = (
			);
			productName = "ScrollStop Extension (iOS)";
			productReference = 3DBE1C812DDB8900007A7E2A /* ScrollStop Extension.appex */;
			productType = "com.apple.product-type.app-extension";
		};
		3DBE1C8A2DDB8900007A7E2A /* ScrollStop Extension (macOS) */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = 3DBE1CBB2DDB8900007A7E2A /* Build configuration list for PBXNativeTarget "ScrollStop Extension (macOS)" */;
			buildPhases = (
				3DBE1C872DDB8900007A7E2A /* Sources */,
				3DBE1C882DDB8900007A7E2A /* Frameworks */,
				3DBE1C892DDB8900007A7E2A /* Resources */,
			);
			buildRules = (
			);
			dependencies = (
			);
			fileSystemSynchronizedGroups = (
				3DBE1C8F2DDB8900007A7E2A /* macOS (Extension) */,
			);
			name = "ScrollStop Extension (macOS)";
			packageProductDependencies = (
			);
			productName = "ScrollStop Extension (macOS)";
			productReference = 3DBE1C8B2DDB8900007A7E2A /* ScrollStop Extension.appex */;
			productType = "com.apple.product-type.app-extension";
		};
/* End PBXNativeTarget section */

/* Begin PBXProject section */
		3DBE1C472DDB88FF007A7E2A /* Project object */ = {
			isa = PBXProject;
			attributes = {
				BuildIndependentTargetsInParallel = 1;
				LastSwiftUpdateCheck = 1630;
				LastUpgradeCheck = 1630;
				TargetAttributes = {
					3DBE1C622DDB8900007A7E2A = {
						CreatedOnToolsVersion = 16.3;
					};
					3DBE1C742DDB8900007A7E2A = {
						CreatedOnToolsVersion = 16.3;
					};
					3DBE1C802DDB8900007A7E2A = {
						CreatedOnToolsVersion = 16.3;
					};
					3DBE1C8A2DDB8900007A7E2A = {
						CreatedOnToolsVersion = 16.3;
					};
				};
			};
			buildConfigurationList = 3DBE1C4A2DDB88FF007A7E2A /* Build configuration list for PBXProject "ScrollStop" */;
			developmentRegion = en;
			hasScannedForEncodings = 0;
			knownRegions = (
				en,
				Base,
			);
			mainGroup = 3DBE1C462DDB88FF007A7E2A;
			minimizedProjectReferenceProxies = 1;
			preferredProjectObjectVersion = 77;
			productRefGroup = 3DBE1C642DDB8900007A7E2A /* Products */;
			projectDirPath = "";
			projectRoot = "";
			targets = (
				3DBE1C622DDB8900007A7E2A /* ScrollStop (iOS) */,
				3DBE1C742DDB8900007A7E2A /* ScrollStop (macOS) */,
				3DBE1C802DDB8900007A7E2A /* ScrollStop Extension (iOS) */,
				3DBE1C8A2DDB8900007A7E2A /* ScrollStop Extension (macOS) */,
			);
		};
/* End PBXProject section */

/* Begin PBXResourcesBuildPhase section */
		3DBE1C612DDB8900007A7E2A /* Resources */ = {
			isa = PBXResourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
		3DBE1C732DDB8900007A7E2A /* Resources */ = {
			isa = PBXResourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
		3DBE1C7F2DDB8900007A7E2A /* Resources */ = {
			isa = PBXResourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
		3DBE1C892DDB8900007A7E2A /* Resources */ = {
			isa = PBXResourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXResourcesBuildPhase section */

/* Begin PBXSourcesBuildPhase section */
		3DBE1C5F2DDB8900007A7E2A /* Sources */ = {
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
		3DBE1C712DDB8900007A7E2A /* Sources */ = {
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
		3DBE1C7D2DDB8900007A7E2A /* Sources */ = {
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
		3DBE1C872DDB8900007A7E2A /* Sources */ = {
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXSourcesBuildPhase section */

/* Begin PBXTargetDependency section */
		3DBE1C842DDB8900007A7E2A /* PBXTargetDependency */ = {
			isa = PBXTargetDependency;
			target = 3DBE1C802DDB8900007A7E2A /* ScrollStop Extension (iOS) */;
			targetProxy = 3DBE1C832DDB8900007A7E2A /* PBXContainerItemProxy */;
		};
		3DBE1C8E2DDB8900007A7E2A /* PBXTargetDependency */ = {
			isa = PBXTargetDependency;
			target = 3DBE1C8A2DDB8900007A7E2A /* ScrollStop Extension (macOS) */;
			targetProxy = 3DBE1C8D2DDB8900007A7E2A /* PBXContainerItemProxy */;
		};
/* End PBXTargetDependency section */

/* Begin XCBuildConfiguration section */
		3DBE1CB22DDB8900007A7E2A /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				GENERATE_INFOPLIST_FILE = YES;
				INFOPLIST_FILE = "iOS (Extension)/Info.plist";
				INFOPLIST_KEY_CFBundleDisplayName = "[REDACTED]";
				INFOPLIST_KEY_NSHumanReadableCopyright = "[REDACTED]";
				IPHONEOS_DEPLOYMENT_TARGET = 15.0;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
					"@executable_path/../../Frameworks",
				);
				MARKETING_VERSION = 1.0;
				OTHER_LDFLAGS = (
					"-framework",
					SafariServices,
				);
				PRODUCT_BUNDLE_IDENTIFIER = Luddite.ScrollStop.Extension;
				PRODUCT_NAME = "ScrollStop Extension";
				SDKROOT = iphoneos;
				SKIP_INSTALL = YES;
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
			};
			name = Debug;
		};
		3DBE1CB32DDB8900007A7E2A /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				GENERATE_INFOPLIST_FILE = YES;
				INFOPLIST_FILE = "iOS (Extension)/Info.plist";
				INFOPLIST_KEY_CFBundleDisplayName = "[REDACTED]";
				INFOPLIST_KEY_NSHumanReadableCopyright = "[REDACTED]";
				IPHONEOS_DEPLOYMENT_TARGET = 15.0;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
					"@executable_path/../../Frameworks",
				);
				MARKETING_VERSION = 1.0;
				OTHER_LDFLAGS = (
					"-framework",
					SafariServices,
				);
				PRODUCT_BUNDLE_IDENTIFIER = Luddite.ScrollStop.Extension;
				PRODUCT_NAME = "ScrollStop Extension";
				SDKROOT = iphoneos;
				SKIP_INSTALL = YES;
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
				VALIDATE_PRODUCT = YES;
			};
			name = Release;
		};
		3DBE1CB72DDB8900007A7E2A /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				GENERATE_INFOPLIST_FILE = YES;
				INFOPLIST_FILE = "iOS (App)/Info.plist";
				INFOPLIST_KEY_CFBundleDisplayName = ScrollStop;
				INFOPLIST_KEY_UIApplicationSupportsIndirectInputEvents = YES;
				INFOPLIST_KEY_UILaunchStoryboardName = LaunchScreen;
				INFOPLIST_KEY_UIMainStoryboardFile = Main;
				INFOPLIST_KEY_UISupportedInterfaceOrientations = "[REDACTED]";
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPad = "[REDACTED]";
				IPHONEOS_DEPLOYMENT_TARGET = 15.0;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				MARKETING_VERSION = 1.0;
				OTHER_LDFLAGS = (
					"-framework",
					SafariServices,
					"-framework",
					WebKit,
				);
				PRODUCT_BUNDLE_IDENTIFIER = Luddite.ScrollStop;
				PRODUCT_NAME = ScrollStop;
				SDKROOT = iphoneos;
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
			};
			name = Debug;
		};
		3DBE1CB82DDB8900007A7E2A /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				GENERATE_INFOPLIST_FILE = YES;
				INFOPLIST_FILE = "iOS (App)/Info.plist";
				INFOPLIST_KEY_CFBundleDisplayName = ScrollStop;
				INFOPLIST_KEY_UIApplicationSupportsIndirectInputEvents = YES;
				INFOPLIST_KEY_UILaunchStoryboardName = LaunchScreen;
				INFOPLIST_KEY_UIMainStoryboardFile = Main;
				INFOPLIST_KEY_UISupportedInterfaceOrientations = "[REDACTED]";
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPad = "[REDACTED]";
				IPHONEOS_DEPLOYMENT_TARGET = 15.0;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				MARKETING_VERSION = 1.0;
				OTHER_LDFLAGS = (
					"-framework",
					SafariServices,
					"-framework",
					WebKit,
				);
				PRODUCT_BUNDLE_IDENTIFIER = Luddite.ScrollStop;
				PRODUCT_NAME = ScrollStop;
				SDKROOT = iphoneos;
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
				VALIDATE_PRODUCT = YES;
			};
			name = Release;
		};
		3DBE1CBC2DDB8900007A7E2A /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				CODE_SIGN_ENTITLEMENTS = "macOS (Extension)/ScrollStop.entitlements";
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				ENABLE_HARDENED_RUNTIME = YES;
				GENERATE_INFOPLIST_FILE = YES;
				INFOPLIST_FILE = "macOS (Extension)/Info.plist";
				INFOPLIST_KEY_CFBundleDisplayName = "[REDACTED]";
				INFOPLIST_KEY_NSHumanReadableCopyright = "[REDACTED]";
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/../Frameworks",
					"@executable_path/../../../../Frameworks",
				);
				MACOSX_DEPLOYMENT_TARGET = 10.14;
				MARKETING_VERSION = 1.0;
				OTHER_LDFLAGS = (
					"-framework",
					SafariServices,
				);
				PRODUCT_BUNDLE_IDENTIFIER = Luddite.ScrollStop.Extension;
				PRODUCT_NAME = "ScrollStop Extension";
				SDKROOT = macosx;
				SKIP_INSTALL = YES;
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
			};
			name = Debug;
		};
		3DBE1CBD2DDB8900007A7E2A /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				CODE_SIGN_ENTITLEMENTS = "macOS (Extension)/ScrollStop.entitlements";
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				ENABLE_HARDENED_RUNTIME = YES;
				GENERATE_INFOPLIST_FILE = YES;
				INFOPLIST_FILE = "macOS (Extension)/Info.plist";
				INFOPLIST_KEY_CFBundleDisplayName = "[REDACTED]";
				INFOPLIST_KEY_NSHumanReadableCopyright = "[REDACTED]";
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/../Frameworks",
					"@executable_path/../../../../Frameworks",
				);
				MACOSX_DEPLOYMENT_TARGET = 10.14;
				MARKETING_VERSION = 1.0;
				OTHER_LDFLAGS = (
					"-framework",
					SafariServices,
				);
				PRODUCT_BUNDLE_IDENTIFIER = Luddite.ScrollStop.Extension;
				PRODUCT_NAME = "ScrollStop Extension";
				SDKROOT = macosx;
				SKIP_INSTALL = YES;
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
			};
			name = Release;
		};
		3DBE1CC12DDB8900007A7E2A /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				CODE_SIGN_ENTITLEMENTS = "macOS (App)/ScrollStop.entitlements";
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				ENABLE_HARDENED_RUNTIME = YES;
				GENERATE_INFOPLIST_FILE = YES;
				INFOPLIST_KEY_CFBundleDisplayName = ScrollStop;
				INFOPLIST_KEY_NSMainStoryboardFile = Main;
				INFOPLIST_KEY_NSPrincipalClass = NSApplication;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/../Frameworks",
				);
				MACOSX_DEPLOYMENT_TARGET = 10.14;
				MARKETING_VERSION = 1.0;
				OTHER_LDFLAGS = (
					"-framework",
					SafariServices,
					"-framework",
					WebKit,
				);
				PRODUCT_BUNDLE_IDENTIFIER = Luddite.ScrollStop;
				PRODUCT_NAME = ScrollStop;
				REGISTER_APP_GROUPS = YES;
				SDKROOT = macosx;
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
			};
			name = Debug;
		};
		3DBE1CC22DDB8900007A7E2A /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				CODE_SIGN_ENTITLEMENTS = "macOS (App)/ScrollStop.entitlements";
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				ENABLE_HARDENED_RUNTIME = YES;
				GENERATE_INFOPLIST_FILE = YES;
				INFOPLIST_KEY_CFBundleDisplayName = ScrollStop;
				INFOPLIST_KEY_NSMainStoryboardFile = Main;
				INFOPLIST_KEY_NSPrincipalClass = NSApplication;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/../Frameworks",
				);
				MACOSX_DEPLOYMENT_TARGET = 10.14;
				MARKETING_VERSION = 1.0;
				OTHER_LDFLAGS = (
					"-framework",
					SafariServices,
					"-framework",
					WebKit,
				);
				PRODUCT_BUNDLE_IDENTIFIER = Luddite.ScrollStop;
				PRODUCT_NAME = ScrollStop;
				REGISTER_APP_GROUPS = YES;
				SDKROOT = macosx;
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_VERSION = 5.0;
			};
			name = Release;
		};
		3DBE1CC52DDB8900007A7E2A /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOL_EXTENSIONS = YES;
				CLANG_ANALYZER_NONNULL = YES;
				CLANG_ANALYZER_NUMBER_OBJECT_CONVERSION = YES_AGGRESSIVE;
				CLANG_CXX_LANGUAGE_STANDARD = "gnu++20";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_ENABLE_OBJC_WEAK = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_DOCUMENTATION_COMMENTS = YES;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNGUARDED_AVAILABILITY = YES_AGGRESSIVE;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = dwarf;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				ENABLE_TESTABILITY = YES;
				ENABLE_USER_SCRIPT_SANDBOXING = YES;
				GCC_C_LANGUAGE_STANDARD = gnu17;
				GCC_DYNAMIC_NO_PIC = NO;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_OPTIMIZATION_LEVEL = 0;
				GCC_PREPROCESSOR_DEFINITIONS = (
					"DEBUG=1",
					"$(inherited)",
				);
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDECLARED_SELECTOR = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				LOCALIZATION_PREFERS_STRING_CATALOGS = YES;
				MTL_ENABLE_DEBUG_INFO = INCLUDE_SOURCE;
				MTL_FAST_MATH = YES;
				ONLY_ACTIVE_ARCH = YES;
				SWIFT_ACTIVE_COMPILATION_CONDITIONS = "DEBUG $(inherited)";
				SWIFT_OPTIMIZATION_LEVEL = "-Onone";
			};
			name = Debug;
		};
		3DBE1CC62DDB8900007A7E2A /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOL_EXTENSIONS = YES;
				CLANG_ANALYZER_NONNULL = YES;
				CLANG_ANALYZER_NUMBER_OBJECT_CONVERSION = YES_AGGRESSIVE;
				CLANG_CXX_LANGUAGE_STANDARD = "gnu++20";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_ENABLE_OBJC_WEAK = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_DOCUMENTATION_COMMENTS = YES;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNGUARDED_AVAILABILITY = YES_AGGRESSIVE;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = "dwarf-with-dsym";
				ENABLE_NS_ASSERTIONS = NO;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				ENABLE_USER_SCRIPT_SANDBOXING = YES;
				GCC_C_LANGUAGE_STANDARD = gnu17;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDECLARED_SELECTOR = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				LOCALIZATION_PREFERS_STRING_CATALOGS = YES;
				MTL_ENABLE_DEBUG_INFO = NO;
				MTL_FAST_MATH = YES;
				SWIFT_COMPILATION_MODE = wholemodule;
			};
			name = Release;
		};
/* End XCBuildConfiguration section */

/* Begin XCConfigurationList section */
		3DBE1C4A2DDB88FF007A7E2A /* Build configuration list for PBXProject "ScrollStop" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				3DBE1CC52DDB8900007A7E2A /* Debug */,
				3DBE1CC62DDB8900007A7E2A /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
		3DBE1CB12DDB8900007A7E2A /* Build configuration list for PBXNativeTarget "ScrollStop Extension (iOS)" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				3DBE1CB22DDB8900007A7E2A /* Debug */,
				3DBE1CB32DDB8900007A7E2A /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
		3DBE1CB62DDB8900007A7E2A /* Build configuration list for PBXNativeTarget "ScrollStop (iOS)" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				3DBE1CB72DDB8900007A7E2A /* Debug */,
				3DBE1CB82DDB8900007A7E2A /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
		3DBE1CBB2DDB8900007A7E2A /* Build configuration list for PBXNativeTarget "ScrollStop Extension (macOS)" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				3DBE1CBC2DDB8900007A7E2A /* Debug */,
				3DBE1CBD2DDB8900007A7E2A /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
		3DBE1CC02DDB8900007A7E2A /* Build configuration list for PBXNativeTarget "ScrollStop (macOS)" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				3DBE1CC12DDB8900007A7E2A /* Debug */,
				3DBE1CC22DDB8900007A7E2A /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
/* End XCConfigurationList section */
	};
	rootObject = 3DBE1C472DDB88FF007A7E2A /* Project object */;
}

```
- **Shared (App)/**
  - **Assets.xcassets/**
    - **AccentColor.colorset/**
      - Contents.json (123 bytes)
        - Content preview:
```
{
  "colors" : [
    {
      "idiom" : "universal"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}

```
    - **AppIcon.appiconset/**
      - Contents.json (1429 bytes)
        - Content preview:
```
{
  "images" : [
    {
      "idiom" : "universal",
      "platform" : "ios",
      "size" : "1024x1024"
    },
    {
      "appearances" : [
        {
          "appearance" : "luminosity",
          "value" : "dark"
        }
      ],
      "idiom" : "universal",
      "platform" : "ios",
      "size" : "1024x1024"
    },
    {
      "appearances" : [
        {
          "appearance" : "luminosity",
          "value" : "tinted"
        }
      ],
      "idiom" : "universal",
      "platform" : "ios",
      "size" : "1024x1024"
    },
    {
      "idiom" : "mac",
      "scale" : "1x",
      "size" : "16x16"
    },
    {
      "idiom" : "mac",
      "scale" : "2x",
      "size" : "16x16"
    },
    {
      "idiom" : "mac",
      "scale" : "1x",
      "size" : "32x32"
    },
    {
      "idiom" : "mac",
      "scale" : "2x",
      "size" : "32x32"
    },
    {
      "idiom" : "mac",
      "scale" : "1x",
      "size" : "128x128"
    },
    {
      "idiom" : "mac",
      "scale" : "2x",
      "size" : "128x128"
    },
    {
      "idiom" : "mac",
      "scale" : "1x",
      "size" : "256x256"
    },
    {
      "idiom" : "mac",
      "scale" : "2x",
      "size" : "256x256"
    },
    {
      "idiom" : "mac",
      "scale" : "1x",
      "size" : "512x512"
    },
    {
      "idiom" : "mac",
      "scale" : "2x",
      "size" : "512x512"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}

```
    - **LargeIcon.imageset/**
      - Contents.json (271 bytes)
        - Content preview:
```
{
  "images" : [
    {
      "idiom" : "universal",
      "scale" : "1x"
    },
    {
      "idiom" : "universal",
      "scale" : "2x"
    },
    {
      "idiom" : "universal",
      "scale" : "3x"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}

```
    - Contents.json (63 bytes)
      - Content preview:
```
{
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}

```
  - **Resources/**
    - **Base.lproj/**
      - Main.html (1390 bytes)
        - Content preview:
```
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no"
    />

    <link rel="stylesheet" href="../Style.css" />
    <script src="../Script.js" defer></script>
  </head>
  <body>
    <img src="../Icon.png" width="128" height="128" alt="ScrollStop Icon" />
    <h1>ScrollStop</h1>
    <p class="platform-ios">
      You can turn on ScrollStop's Safari extension in Settings.
    </p>
    <p class="platform-mac state-unknown">
      You can turn on ScrollStop's extension in Safari Extensions preferences.
    </p>
    <p class="platform-mac state-on">
      ScrollStop's extension is currently on. You can turn it off in Safari
      Extensions preferences.
    </p>
    <p class="platform-mac state-off">
      ScrollStop's extension is currently off. You can turn it on in Safari
      Extensions preferences.
    </p>
    <button class="platform-mac open-preferences">
      Quit and Open Safari Extensions Preferences…
    </button>

    <div style="margin-top: 2rem">
      <a
        href="About.html"
        style="color: #2a9d8f; text-decoration: none; font-size: 14px"
        >About ScrollStop & Credits</a
      >
    </div>
  </body>
</html>

```
    - About.html (2414 bytes)
      - Content preview:
```
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no"
    />
    <link rel="stylesheet" href="../Style.css" />
    <style>
      .credits {
        max-width: 600px;
        margin: 2rem auto;
        padding: 1rem;
        text-align: left;
        line-height: 1.6;
      }
      .credits h3 {
        color: var(--primary-color, #2a9d8f);
        margin-top: 2rem;
        margin-bottom: 1rem;
      }
      .credits p {
        margin-bottom: 1rem;
      }
      .credits a {
        color: var(--primary-color, #2a9d8f);
      }
      .back-button {
        margin: 2rem;
        padding: 0.5rem 1rem;
        background: var(--primary-color, #2a9d8f);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
      .back-button:hover {
        background: #238a7a;
      }
    </style>
  </head>
  <body>
    <div class="credits">
      <h2>About ScrollStop</h2>

      <p><strong>Version:</strong> 1.0</p>
      <p><strong>Developer:</strong> Oliver Staub</p>

      <h3>Description</h3>
      <p>
        ScrollStop is a Safari extension that helps you break free from endless
        scrolling and doomscrolling habits on social media websites. When you
        scroll too much, it blocks the site for 60 minutes and encourages you to
        do something more productive.
      </p>

      <h3>Credits & Attribution</h3>
      <p>
        This Safari extension is based on the Chrome extension
        <strong>"Doomscroll Blocker"</strong> by <strong>Jason Zhang</strong>,
        originally released in 2024 under the Apache License 2.0.
      </p>

      <p>
        <strong>Original Chrome Extension:</strong><br />
        Author: Jason Zhang<br />
        License: Apache License 2.0<br />
        Year: 2024
      </p>
    </div>

    <button class="back-button" onclick="goBack()">← Back</button>

    <script>
      function goBack() {
        // Try to go back in history first
        if (window.history.length > 1) {
          window.history.back();
        } else {
          // If no history, load the main page
          window.location.href = "Main.html";
        }
      }
    </script>
  </body>
</html>

```
    - Icon.png (100020 bytes)
    - Script.js (1346 bytes)
      - Content preview:
```
function show(platform, enabled, useSettingsInsteadOfPreferences) {
    document.body.classList.add(`platform-${platform}`);

    if (useSettingsInsteadOfPreferences) {
        document.getElementsByClassName('platform-mac state-on')[0].innerText = "ScrollStop’s extension is currently on. You can turn it off in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-off')[0].innerText = "ScrollStop’s extension is currently off. You can turn it on in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-unknown')[0].innerText = "You can turn on ScrollStop’s extension in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac open-preferences')[0].innerText = "Quit and Open Safari Settings…";
    }

    if (typeof enabled === "boolean") {
        document.body.classList.toggle(`state-on`, enabled);
        document.body.classList.toggle(`state-off`, !enabled);
    } else {
        document.body.classList.remove(`state-on`);
        document.body.classList.remove(`state-off`);
    }
}

function openPreferences() {
    webkit.messageHandlers.controller.postMessage("open-preferences");
}

document.querySelector("button.open-preferences").addEventListener("click", openPreferences);

```
    - Style.css (954 bytes)
      - Content preview:
```
* {
    -webkit-user-select: none;
    -webkit-user-drag: none;
    cursor: default;
}

:root {
    color-scheme: light dark;

    --spacing: 20px;
}

html {
    height: 100%;
}

body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    gap: var(--spacing);
    margin: 0 calc(var(--spacing) * 2);
    height: 100%;

    font: -apple-system-short-body;
    text-align: center;
}

body:not(.platform-mac, .platform-ios) :is(.platform-mac, .platform-ios) {
    display: none;
}

body.platform-ios .platform-mac {
    display: none;
}

body.platform-mac .platform-ios {
    display: none;
}

body.platform-ios .platform-mac {
    display: none;
}

body:not(.state-on, .state-off) :is(.state-on, .state-off) {
    display: none;
}

body.state-on :is(.state-off, .state-unknown) {
    display: none;
}

body.state-off :is(.state-on, .state-unknown) {
    display: none;
}

button {
    font-size: 1em;
}

```
  - ViewController.swift (3670 bytes)
    - Content preview:
```
//
//  ViewController.swift
//  Shared (App)
//
//  Created by Oliver Staub on 19.05.2025.
//

import WebKit

#if os(iOS)
import UIKit
typealias PlatformViewController = UIViewController
#elseif os(macOS)
import Cocoa
import SafariServices
typealias PlatformViewController = NSViewController
#endif

let extensionBundleIdentifier = "Luddite.ScrollStop.Extension"

class ViewController: PlatformViewController, WKNavigationDelegate, WKScriptMessageHandler {

    @IBOutlet var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        self.webView.navigationDelegate = self

#if os(iOS)
        self.webView.scrollView.isScrollEnabled = false
#endif

        self.webView.configuration.userContentController.add(self, name: "controller")

        self.webView.loadFileURL(Bundle.main.url(forResource: "Main", withExtension: "html")!, allowingReadAccessTo: Bundle.main.resourceURL!)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
#if os(iOS)
        webView.evaluateJavaScript("show('ios')")
#elseif os(macOS)
        webView.evaluateJavaScript("show('mac')")

        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            guard let state = state, error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            DispatchQueue.main.async {
                if #available(macOS 13, *) {
                    webView.evaluateJavaScript("show('mac', \(state.isEnabled), true)")
                } else {
                    webView.evaluateJavaScript("show('mac', \(state.isEnabled), false)")
                }
            }
        }
#endif
    }

    // MARK: - Navigation Delegate (Fix for About link)
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        
        guard let url = navigationAction.request.url else {
            decisionHandler(.cancel)
            return
        }
        
        // Allow navigation to local HTML files
        if url.isFileURL {
            // Check if it's our About.html file
            if url.lastPathComponent == "About.html" {
                // Load the About.html file with proper access
                if let aboutURL = Bundle.main.url(forResource: "About", withExtension: "html") {
                    webView.loadFileURL(aboutURL, allowingReadAccessTo: Bundle.main.resourceURL!)
                }
                decisionHandler(.cancel)
                return
            }
        }
        
        // For external links, open in default browser
        if !url.isFileURL {
#if os(macOS)
            NSWorkspace.shared.open(url)
#elseif os(iOS)
            if UIApplication.shared.canOpenURL(url) {
                UIApplication.shared.open(url)
            }
#endif
            decisionHandler(.cancel)
            return
        }
        
        decisionHandler(.allow)
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
#if os(macOS)
        if (message.body as! String != "open-preferences") {
            return
        }

        SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
            guard error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            DispatchQueue.main.async {
                NSApp.terminate(self)
            }
        }
#endif
    }
}
```
- **Shared (Extension)/**
  - **Resources/**
    - **_locales/**
      - **de/**
        - messages.json (439 bytes)
          - Content preview:
```
{
  "extension_name": {
    "message": "ScrollStop",
    "description": "Der Name der Safari Extension."
  },
  "extension_description": {
    "message": "Hilft dir mit dem Doomscrollen aufzuhören. Scrollst du zu viel, stoppt die Extension dich",
    "description": "Was macht die extension."
  },
  "popup_message":{
    "message": "Die App läuft im Hintergrund 🗣️🗣️🗣️",
    "description": "Mitteilung vom Popup."
  }
}w

```
      - **en/**
        - messages.json (495 bytes)
          - Content preview:
```
{
  "extension_name": {
    "message": "ScrollStop",
    "description": "The display name for the extension."
  },
  "extension_description": {
    "message": "Prevent endless scrolling and doomscrolling on social media sites. Block your access when you scroll too much!",
    "description": "Description of what the extension does."
  },
  "popup_message": {
    "message": "Die App is running in the background 🗣️🗣️🗣️",
    "description": "Message from the popup screen."
  }
}

```
    - **images/**
      - icon-128.png (15002 bytes)
      - icon-256.png (43408 bytes)
      - icon-48.png (3436 bytes)
      - icon-512.png (131545 bytes)
      - icon-64.png (5151 bytes)
      - icon-96.png (9749 bytes)
      - toolbar-icon.svg (943 bytes)
        - Content preview:
```
<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.9375 15.9453">
  <path d="M7.96875 15.9375C12.3281 15.9375 15.9375 12.3203 15.9375 7.96875C15.9375 3.60938 12.3203 0 7.96094 0C3.60938 0 0 3.60938 0 7.96875C0 12.3203 3.61719 15.9375 7.96875 15.9375ZM7.96875 14.6094C4.28125 14.6094 1.33594 11.6562 1.33594 7.96875C1.33594 4.28125 4.27344 1.32812 7.96094 1.32812C11.6484 1.32812 14.6094 4.28125 14.6094 7.96875C14.6094 11.6562 11.6562 14.6094 7.96875 14.6094Z" />
  <path d="M4.53906 8.50781C4.53906 8.70312 4.69531 8.84375 4.89844 8.84375L7.54688 8.84375L6.13281 12.6406C5.94531 13.1406 6.47656 13.4141 6.80469 13.0078L11.0859 7.63281C11.1719 7.53906 11.2188 7.42969 11.2188 7.32812C11.2188 7.13281 11.0625 6.99219 10.8594 6.99219L8.21094 6.99219L9.625 3.19531C9.8125 2.69531 9.28125 2.42188 8.95312 2.82031L4.67188 8.19531C4.58594 8.29688 4.53906 8.40625 4.53906 8.50781Z" />
</svg>

```
    - **modules/**
      - **blocking-screen/**
        - blocking-screen.css (3859 bytes)
          - Content preview:
```
/* modules/blocking-screen/blocking-screen.css */
/* Styles for the full blocking screen */

.blocking-screen {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  text-align: center;
  padding: 2rem;
  box-sizing: border-box;
}

.blocking-content {
  max-width: 600px;
  width: 100%;
}

.blocking-emoji {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: gentle-pulse 3s infinite;
}

.blocking-title {
  font-size: 3rem;
  margin: 0 0 1rem 0;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.blocking-description {
  font-size: 1.5rem;
  margin: 0 0 2rem 0;
  opacity: 0.9;
  line-height: 1.4;
}

.countdown-display {
  background: rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  border-radius: 15px;
  margin: 2rem 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.time-remaining {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.countdown-label {
  font-size: 1.2rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}

.suggestions-container {
  margin-top: 2rem;
}

.suggestions-title {
  font-size: 1.1rem;
  margin: 1rem 0;
  opacity: 0.8;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.suggestion-item {
  background: rgba(255, 255, 255, 0.15);
  padding: 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.suggestion-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.suggestion-emoji {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.suggestion-text {
  font-size: 0.9rem;
  line-height: 1.3;
}

.close-tab-button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 12px 24px;
  font-size: 1.1rem;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 2rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.close-tab-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close-tab-button:active {
  transform: translateY(0);
}

/* Animations */
@keyframes gentle-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes countdown-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.time-remaining.updating {
  animation: countdown-pulse 0.5s ease-in-out;
}

/* Responsive design */
@media (max-width: 768px) {
  .blocking-screen {
    padding: 1rem;
  }

  .blocking-title {
    font-size: 2.5rem;
  }

  .blocking-description {
    font-size: 1.3rem;
  }

  .time-remaining {
    font-size: 2.5rem;
  }

  .suggestions-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.8rem;
  }

  .suggestion-item {
    padding: 0.8rem;
  }

  .blocking-emoji {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .blocking-title {
    font-size: 2rem;
  }

  .blocking-description {
    font-size: 1.1rem;
  }

  .time-remaining {
    font-size: 2rem;
  }

  .countdown-label {
    font-size: 1rem;
  }

  .suggestions-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .suggestion-item {
    padding: 0.6rem;
  }

  .suggestion-emoji {
    font-size: 1.5rem;
  }

  .suggestion-text {
    font-size: 0.8rem;
  }

  .close-tab-button {
    padding: 10px 20px;
    font-size: 1rem;
  }
}

```
        - blocking-screen.js (7128 bytes)
          - Content preview:
```
// modules/blocking-screen/blocking-screen.js
// Module for showing the full blocking screen with countdown

if (typeof window.BlockingScreen === "undefined") {
  class BlockingScreen {
    constructor(config = {}) {
      this.config = {
        UPDATE_INTERVAL: config.updateInterval || 1000, // Update countdown every second
        ...config,
      };

      this.blockingElement = null;
      this.countdownInterval = null;
      this.hostname = window.location.hostname;
    }

    /**
     * Show the blocking screen
     */
    async show() {
      try {
        // Clear existing content
        this.clearPageContent();

        // Create blocking screen
        this.createBlockingElement();

        // Start countdown updates
        this.startCountdownUpdates();
      } catch (error) {
        console.error("Error showing blocking screen:", error);
        this.cleanup();
      }
    }

    /**
     * Clear all existing page content
     */
    clearPageContent() {
      document.body.innerHTML = "";
    }

    /**
     * Create the blocking screen element
     */
    createBlockingElement() {
      this.blockingElement = document.createElement("div");
      this.blockingElement.id = "time-block-screen";
      this.blockingElement.className = "blocking-screen";

      this.applyBlockingStyles();
      this.updateBlockingContent();

      document.body.appendChild(this.blockingElement);
    }

    /**
     * Apply styles to blocking screen element
     */
    applyBlockingStyles() {
      if (!this.blockingElement) return;

      this.blockingElement.style.cssText = `
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999999;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        text-align: center;
        padding: 2rem;
        box-sizing: border-box;
      `;
    }

    /**
     * Update blocking screen content
     */
    updateBlockingContent() {
      if (!this.blockingElement) return;

      this.blockingElement.innerHTML = `
        <div style="max-width: 600px; width: 100%;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🌱</div>
          <h1 style="font-size: 3rem; margin: 0 0 1rem 0; font-weight: 700;">
            Time to Touch Grass!
          </h1>
          <p style="font-size: 1.5rem; margin: 0 0 2rem 0; opacity: 0.9; line-height: 1.4;">
            You've been scrolling too much. This site is blocked for 60 minutes.
          </p>
          
          <div id="countdown-display" style="
            background: rgba(255, 255, 255, 0.2);
            padding: 1.5rem;
            border-radius: 15px;
            margin: 2rem 0;
            backdrop-filter: blur(10px);
          ">
            <div style="font-size: 3rem; font-weight: 700; margin-bottom: 0.5rem;" id="time-remaining">
              Loading...
            </div>
            <div style="font-size: 1.2rem; opacity: 0.8;">
              until you can access this site again
            </div>
          </div>
          
          ${this.getSuggestionsHTML()}
        </div>
      `;
    }

    /**
     * Get HTML for activity suggestions
     * @returns {string} HTML for suggestions section
     */
    getSuggestionsHTML() {
      const suggestions = [
        { emoji: "🚶‍♂️", text: "Take a walk outside" },
        { emoji: "📚", text: "Read a book" },
        { emoji: "🧘‍♀️", text: "Meditate" },
        { emoji: "💪", text: "Exercise" },
        { emoji: "👥", text: "Call a friend" },
        { emoji: "🎨", text: "Be creative" },
      ];

      const suggestionsGrid = suggestions
        .map(
          (suggestion) => `
        <div style="background: rgba(255, 255, 255, 0.15); padding: 1rem; border-radius: 10px;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">${suggestion.emoji}</div>
          <div>${suggestion.text}</div>
        </div>
      `
        )
        .join("");

      return `
        <div style="margin-top: 2rem;">
          <p style="font-size: 1.1rem; margin: 1rem 0; opacity: 0.8;">
            Here are some better things you could be doing:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
            ${suggestionsGrid}
          </div>
        </div>
      `;
    }

    /**
     * Start countdown updates
     */
    startCountdownUpdates() {
      // Update immediately
      this.updateCountdown();

      // Then update every second
      this.countdownInterval = setInterval(() => {
        this.updateCountdown();
      }, this.config.UPDATE_INTERVAL);
    }

    /**
     * Update the countdown display
     */
    async updateCountdown() {
      try {
        const remainingTime = await TimeManager.getRemainingTime(this.hostname);

        if (remainingTime <= 0) {
          // Time's up! Remove block and reload
          await TimeManager.removeTimeBlock(this.hostname);
          window.location.reload();
          return;
        }

        // Update display
        const timeDisplay = TimeManager.formatTime(remainingTime);
        const countdownElement = document.getElementById("time-remaining");

        if (countdownElement) {
          countdownElement.textContent = timeDisplay;
        }
      } catch (error) {
        console.error("Error updating countdown:", error);
      }
    }

    /**
     * Stop countdown updates
     */
    stopCountdownUpdates() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    }

    /**
     * Clean up the blocking screen
     */
    cleanup() {
      this.stopCountdownUpdates();

      if (this.blockingElement && this.blockingElement.parentNode) {
        this.blockingElement.parentNode.removeChild(this.blockingElement);
        this.blockingElement = null;
      }
    }

    /**
     * Check if blocking screen is currently showing
     * @returns {boolean} True if blocking screen is active
     */
    isActive() {
      return this.countdownInterval !== null;
    }

    /**
     * Update the blocked site name in display
     * @param {string} siteName - Name of the blocked site
     */
    updateSiteName(siteName) {
      if (!this.blockingElement) return;

      const titleElement = this.blockingElement.querySelector("p");
      if (titleElement) {
        titleElement.textContent = `You've been scrolling too much on ${siteName}. This site is blocked for 60 minutes.`;
      }
    }

    /**
     * Force refresh the countdown (useful for testing)
     */
    refreshCountdown() {
      this.updateCountdown();
    }
  }

  // Export for use in other modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = BlockingScreen;
  } else {
    window.BlockingScreen = BlockingScreen;
  }
}

```
      - **doomscroll-detector/**
        - doomscroll-animation.css (1112 bytes)
          - Content preview:
```
/* modules/doomscroll-detector/doomscroll-animation.css */
/* Styles for the doomscroll warning animation */

.doomscroll-warning {
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 999999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.1);
  color: #f94144;
  font-weight: bolder;
  text-align: center;
  font-size: 7vw;
  font-family: Arial, sans-serif;
  transition: opacity 0.3s ease;
  opacity: 0;
  pointer-events: none;
}

.doomscroll-warning.flashing {
  animation: doomscroll-flash 0.4s infinite;
}

@keyframes doomscroll-flash {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.doomscroll-warning.visible {
  opacity: 1;
}

/* Content fade-out animation */
.content-fade-out {
  transition: opacity 7s ease;
  opacity: 0;
}

/* Responsive design for smaller screens */
@media (max-width: 768px) {
  .doomscroll-warning {
    font-size: 12vw;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .doomscroll-warning {
    font-size: 15vw;
  }
}

```
        - doomscroll-animation.js (5595 bytes)
          - Content preview:
```
// modules/doomscroll-detector/doomscroll-animation.js
// Module for handling the doomscroll warning animation

if (typeof window.DoomscrollAnimation === "undefined") {
  class DoomscrollAnimation {
    constructor(config = {}) {
      this.config = {
        FLASH_INTERVAL: config.flashInterval || 400, // Warning flash interval in ms
        SCREEN_DECAY_TIME: config.screenDecayTime || 7, // Time in seconds for content to fade out
        ...config,
      };

      this.warningElement = null;
      this.flashIntervalId = null;
      this.isWarningVisible = false;
      this.originalContent = [];
    }

    /**
     * Start the doomscroll warning animation
     */
    async startAnimation() {
      try {
        // Create and show warning element
        this.createWarningElement();

        // Store reference to original content
        this.storeOriginalContent();

        // Set up fade-out transition for existing content
        this.setupContentTransition();

        // Start flashing warning
        this.startFlashing();

        // Begin fade-out process
        setTimeout(() => {
          this.fadeOutContent();
        }, 100);

        // Complete animation after decay time
        setTimeout(() => {
          this.completeAnimation();
        }, this.config.SCREEN_DECAY_TIME * 1000);
      } catch (error) {
        console.error("Error in doomscroll animation:", error);
        this.cleanup();
      }
    }

    /**
     * Create the warning overlay element
     */
    createWarningElement() {
      if (this.warningElement) {
        return; // Already created
      }

      this.warningElement = document.createElement("div");
      this.warningElement.id = "doomscroll-warning";
      this.warningElement.className = "doomscroll-warning";
      this.warningElement.textContent = "DOOMSCROLL!";

      // Apply styles
      this.applyWarningStyles();

      document.body.appendChild(this.warningElement);
    }

    /**
     * Apply styles to warning element
     */
    applyWarningStyles() {
      if (!this.warningElement) return;

      this.warningElement.style.cssText = `
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: rgba(0, 0, 0, 0.1);
        color: #f94144;
        font-weight: bolder;
        text-align: center;
        font-size: 7vw;
        font-family: Arial, sans-serif;
        transition: opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
      `;
    }

    /**
     * Store references to original page content
     */
    storeOriginalContent() {
      this.originalContent = Array.from(document.body.children).filter(
        (child) => child.id !== "doomscroll-warning"
      );
    }

    /**
     * Set up CSS transitions for content fade-out
     */
    setupContentTransition() {
      this.originalContent.forEach((child) => {
        child.style.transition = `opacity ${this.config.SCREEN_DECAY_TIME}s ease`;
      });
    }

    /**
     * Start the flashing warning animation
     */
    startFlashing() {
      this.flashIntervalId = setInterval(() => {
        this.toggleWarningVisibility();
      }, this.config.FLASH_INTERVAL);
    }

    /**
     * Toggle warning element visibility for flashing effect
     */
    toggleWarningVisibility() {
      if (!this.warningElement) return;

      if (!this.isWarningVisible) {
        this.warningElement.style.opacity = "1";
      } else {
        this.warningElement.style.opacity = "0";
      }
      this.isWarningVisible = !this.isWarningVisible;
    }

    /**
     * Fade out the original page content
     */
    fadeOutContent() {
      this.originalContent.forEach((child) => {
        child.style.opacity = "0";
      });
    }

    /**
     * Complete the animation and dispatch event
     */
    completeAnimation() {
      // Stop flashing
      this.stopFlashing();

      // Remove original content
      this.removeOriginalContent();

      // Dispatch completion event
      window.dispatchEvent(
        new CustomEvent("doomscroll-animation-complete", {
          detail: {
            hostname: window.location.hostname,
          },
        })
      );
    }

    /**
     * Stop the flashing animation
     */
    stopFlashing() {
      if (this.flashIntervalId) {
        clearInterval(this.flashIntervalId);
        this.flashIntervalId = null;
      }
    }

    /**
     * Remove original page content
     */
    removeOriginalContent() {
      this.originalContent.forEach((child) => {
        if (child.parentNode) {
          child.parentNode.removeChild(child);
        }
      });
      this.originalContent = [];
    }

    /**
     * Clean up the animation and remove warning element
     */
    cleanup() {
      this.stopFlashing();

      if (this.warningElement && this.warningElement.parentNode) {
        this.warningElement.parentNode.removeChild(this.warningElement);
        this.warningElement = null;
      }

      this.isWarningVisible = false;
      this.originalContent = [];
    }

    /**
     * Check if animation is currently running
     * @returns {boolean} True if animation is active
     */
    isActive() {
      return this.flashIntervalId !== null;
    }
  }

  // Export for use in other modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = DoomscrollAnimation;
  } else {
    window.DoomscrollAnimation = DoomscrollAnimation;
  }
}

```
        - doomscroll-detector.js (3135 bytes)
          - Content preview:
```
// modules/doomscroll-detector/doomscroll-detector.js
// Module for detecting excessive scrolling behavior

if (typeof window.DoomscrollDetector === "undefined") {
  class DoomscrollDetector {
    constructor(config = {}) {
      this.config = {
        SCROLL_LIMIT: config.scrollLimit || 4000, // Pixels scrolled before triggering
        ...config,
      };

      this.scrollDistance = 0;
      this.isInitialized = false;
      this.scrollHandler = null;
    }

    /**
     * Initialize the doomscroll detector
     */
    initialize() {
      if (this.isInitialized) {
        return;
      }

      this.scrollHandler = this.handleScroll.bind(this);
      window.addEventListener("scroll", this.scrollHandler, { passive: true });
      this.isInitialized = true;

      console.log(
        "DoomscrollDetector initialized with scroll limit:",
        this.config.SCROLL_LIMIT
      );
    }

    /**
     * Destroy the detector and clean up event listeners
     */
    destroy() {
      if (this.scrollHandler) {
        window.removeEventListener("scroll", this.scrollHandler);
        this.scrollHandler = null;
      }
      this.isInitialized = false;
      this.scrollDistance = 0;
    }

    /**
     * Handle scroll events and detect doomscrolling
     */
    handleScroll() {
      const currentScrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollDelta = currentScrollTop - this.scrollDistance;
      this.scrollDistance = currentScrollTop;

      // Only trigger on downward scrolling
      if (scrollDelta > 0 && this.scrollDistance > this.config.SCROLL_LIMIT) {
        this.triggerDoomscrollDetected();
      }
    }

    /**
     * Trigger doomscroll detection event and cleanup
     */
    triggerDoomscrollDetected() {
      // Dispatch custom event that other modules can listen to
      window.dispatchEvent(
        new CustomEvent("doomscroll-detected", {
          detail: {
            scrollDistance: this.scrollDistance,
            scrollLimit: this.config.SCROLL_LIMIT,
            hostname: window.location.hostname,
          },
        })
      );

      // Clean up after detection
      this.destroy();
    }

    /**
     * Reset scroll distance counter
     */
    resetScrollDistance() {
      this.scrollDistance = 0;
    }

    /**
     * Get current scroll distance
     * @returns {number} Current scroll distance in pixels
     */
    getCurrentScrollDistance() {
      return this.scrollDistance;
    }

    /**
     * Get scroll progress as percentage
     * @returns {number} Progress from 0 to 100
     */
    getScrollProgress() {
      return Math.min(
        100,
        (this.scrollDistance / this.config.SCROLL_LIMIT) * 100
      );
    }

    /**
     * Check if detector is active
     * @returns {boolean} True if detector is initialized and listening
     */
    isActive() {
      return this.isInitialized;
    }
  }

  // Export for use in other modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = DoomscrollDetector;
  } else {
    window.DoomscrollDetector = DoomscrollDetector;
  }
}

```
      - **transition-screen/**
        - transition-screen.css (1834 bytes)
          - Content preview:
```
/* modules/transition-screen/transition-screen.css */
/* Styles for the transition screen */

.transition-screen {
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 999999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: linear-gradient(135deg, #8ac926 0%, #52b788 100%);
  color: white;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  opacity: 1;
  pointer-events: all;
}

.transition-container {
  max-width: 600px;
  width: 100%;
  padding: 2rem;
}

.transition-emoji {
  font-size: 5rem;
  margin-bottom: 2rem;
  animation: bounce 2s infinite;
}

.transition-title {
  font-size: 4rem;
  margin-bottom: 2rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.transition-description {
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.4;
}

.transition-countdown {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.8);
}

.countdown-number {
  font-weight: bold;
  font-size: 1.2em;
  color: rgba(255, 255, 255, 1);
}

/* Animations */
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .transition-title {
    font-size: 3rem;
  }

  .transition-description {
    font-size: 1.5rem;
  }

  .transition-emoji {
    font-size: 4rem;
  }

  .transition-container {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .transition-title {
    font-size: 2.5rem;
  }

  .transition-description {
    font-size: 1.2rem;
  }

  .transition-countdown {
    font-size: 1.1rem;
  }

  .transition-emoji {
    font-size: 3rem;
  }
}

```
        - transition-screen.js (5308 bytes)
          - Content preview:
```
// modules/transition-screen/transition-screen.js
// Module for showing the transition screen between animation and blocking

if (typeof window.TransitionScreen === "undefined") {
  class TransitionScreen {
    constructor(config = {}) {
      this.config = {
        TRANSITION_DURATION: config.transitionDuration || 3000, // 3 seconds
        ...config,
      };

      this.transitionElement = null;
      this.countdownInterval = null;
      this.remainingSeconds = 3;
    }

    /**
     * Show the transition screen
     */
    async show() {
      try {
        this.createTransitionElement();
        this.startCountdown();

        // Auto-complete after duration
        setTimeout(() => {
          this.complete();
        }, this.config.TRANSITION_DURATION);
      } catch (error) {
        console.error("Error showing transition screen:", error);
        this.cleanup();
      }
    }

    /**
     * Create the transition screen element
     */
    createTransitionElement() {
      if (this.transitionElement) {
        return; // Already created
      }

      // Find and update existing warning element, or create new one
      this.transitionElement = document.getElementById("doomscroll-warning");

      if (!this.transitionElement) {
        this.transitionElement = document.createElement("div");
        this.transitionElement.id = "transition-screen";
        document.body.appendChild(this.transitionElement);
      }

      this.applyTransitionStyles();
      this.updateTransitionContent();
    }

    /**
     * Apply styles to transition element
     */
    applyTransitionStyles() {
      if (!this.transitionElement) return;

      this.transitionElement.style.cssText = `
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: linear-gradient(135deg, #8ac926 0%, #52b788 100%);
        color: white;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        opacity: 1;
        pointer-events: all;
      `;
    }

    /**
     * Update transition screen content
     */
    updateTransitionContent() {
      if (!this.transitionElement) return;

      this.transitionElement.innerHTML = `
        <div style="max-width: 600px; width: 100%; padding: 2rem;">
          <div style="font-size: 5rem; margin-bottom: 2rem;">🌱</div>
          <div style="font-size: 4rem; margin-bottom: 2rem; font-weight: bold;">
            Touch some grass!
          </div>
          <div style="font-size: 1.8rem; color: rgba(255, 255, 255, 0.9); margin-bottom: 2rem; line-height: 1.4;">
            This site is now blocked for 60 minutes.
          </div>
          <div style="font-size: 1.4rem; color: rgba(255, 255, 255, 0.8);" id="countdown-text">
            Redirecting in <span id="countdown-number">${this.remainingSeconds}</span> seconds...
          </div>
        </div>
      `;
    }

    /**
     * Start the countdown timer
     */
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        this.remainingSeconds--;
        this.updateCountdownDisplay();

        if (this.remainingSeconds <= 0) {
          this.stopCountdown();
        }
      }, 1000);
    }

    /**
     * Update countdown display
     */
    updateCountdownDisplay() {
      const countdownElement = document.getElementById("countdown-number");
      if (countdownElement) {
        countdownElement.textContent = this.remainingSeconds;
      }
    }

    /**
     * Stop the countdown timer
     */
    stopCountdown() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    }

    /**
     * Complete the transition and dispatch event
     */
    complete() {
      this.stopCountdown();

      // Dispatch completion event
      window.dispatchEvent(
        new CustomEvent("transition-screen-complete", {
          detail: {
            hostname: window.location.hostname,
          },
        })
      );
    }

    /**
     * Clean up the transition screen
     */
    cleanup() {
      this.stopCountdown();

      if (this.transitionElement && this.transitionElement.parentNode) {
        this.transitionElement.parentNode.removeChild(this.transitionElement);
        this.transitionElement = null;
      }

      this.remainingSeconds = 3;
    }

    /**
     * Check if transition screen is currently showing
     * @returns {boolean} True if transition is active
     */
    isActive() {
      return this.countdownInterval !== null;
    }

    /**
     * Update transition message
     * @param {string} message - Custom message to display
     */
    updateMessage(message) {
      if (!this.transitionElement) return;

      const messageElement =
        this.transitionElement.querySelector("div:nth-child(3)");
      if (messageElement) {
        messageElement.textContent = message;
      }
    }
  }

  // Export for use in other modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = TransitionScreen;
  } else {
    window.TransitionScreen = TransitionScreen;
  }
}

```
      - **utils/**
        - storage-helper.js (2200 bytes)
          - Content preview:
```
if (typeof window.StorageHelper === "undefined") {
  class StorageHelper {
    /**
     * Get blocked sites from storage
     * @returns {Promise<string[]>} Array of blocked site domains
     */
    static async getBlockedSites() {
      return new Promise((resolve) => {
        browser.storage.local.get(["blockedSites"], (result) => {
          resolve(result.blockedSites || []);
        });
      });
    }

    /**
     * Set blocked sites in storage
     * @param {string[]} sites - Array of site domains to block
     * @returns {Promise<void>}
     */
    static async setBlockedSites(sites) {
      return new Promise((resolve) => {
        browser.storage.local.set({ blockedSites: sites }, () => {
          resolve();
        });
      });
    }

    /**
     * Get time blocks from storage
     * @returns {Promise<Object>} Object with hostname keys and block info values
     */
    static async getTimeBlocks() {
      return new Promise((resolve) => {
        browser.storage.local.get(["timeBlocks"], (result) => {
          resolve(result.timeBlocks || {});
        });
      });
    }

    /**
     * Set time blocks in storage
     * @param {Object} timeBlocks - Object with hostname keys and block info values
     * @returns {Promise<void>}
     */
    static async setTimeBlocks(timeBlocks) {
      return new Promise((resolve) => {
        browser.storage.local.set({ timeBlocks }, () => {
          resolve();
        });
      });
    }

    /**
     * Check if current site is in blocked sites list
     * @param {string} url - Current page URL
     * @param {string} hostname - Current page hostname
     * @returns {Promise<boolean>} True if site should be blocked
     */
    static async isCurrentSiteBlocked(url, hostname) {
      const blockedSites = await this.getBlockedSites();

      return blockedSites.some((site) => {
        const cleanSite = site.replace(/^https?:\/\//, "");
        return url.includes(cleanSite) || hostname.includes(cleanSite);
      });
    }
  }
  // Export for use in other modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = StorageHelper;
  } else {
    window.StorageHelper = StorageHelper;
  }
}

```
        - time-manager.js (4061 bytes)
          - Content preview:
```
if (typeof window.TimeManager === "undefined") {
  class TimeManager {
    static BLOCK_DURATION = 60 * 60 * 1000; // 60 minutes in milliseconds

    /**
     * Check if a site is currently time-blocked
     * @param {string} hostname - The hostname to check
     * @returns {Promise<boolean>} True if site is currently blocked
     */
    static async isTimeBlocked(hostname) {
      const timeBlocks = await StorageHelper.getTimeBlocks();
      const blockInfo = timeBlocks[hostname];

      if (!blockInfo) {
        return false;
      }

      const now = Date.now();
      const timeRemaining = blockInfo.timestamp + this.BLOCK_DURATION - now;

      if (timeRemaining > 0) {
        return true;
      } else {
        // Block expired, remove it
        await this.removeTimeBlock(hostname);
        return false;
      }
    }

    /**
     * Create a new time block for a site
     * @param {string} hostname - The hostname to block
     * @returns {Promise<void>}
     */
    static async createTimeBlock(hostname) {
      const timeBlocks = await StorageHelper.getTimeBlocks();

      timeBlocks[hostname] = {
        timestamp: Date.now(),
        siteName: hostname,
      };

      await StorageHelper.setTimeBlocks(timeBlocks);

      // Dispatch event for other modules to listen to
      window.dispatchEvent(
        new CustomEvent("time-block-created", {
          detail: { hostname, timestamp: timeBlocks[hostname].timestamp },
        })
      );
    }

    /**
     * Remove a time block (when expired or manually cleared)
     * @param {string} hostname - The hostname to unblock
     * @returns {Promise<void>}
     */
    static async removeTimeBlock(hostname) {
      const timeBlocks = await StorageHelper.getTimeBlocks();

      if (timeBlocks[hostname]) {
        delete timeBlocks[hostname];
        await StorageHelper.setTimeBlocks(timeBlocks);

        // Dispatch event for other modules to listen to
        window.dispatchEvent(
          new CustomEvent("time-block-removed", {
            detail: { hostname },
          })
        );
      }
    }

    /**
     * Get remaining time for a blocked site
     * @param {string} hostname - The hostname to check
     * @returns {Promise<number>} Remaining time in milliseconds, or 0 if not blocked
     */
    static async getRemainingTime(hostname) {
      const timeBlocks = await StorageHelper.getTimeBlocks();
      const blockInfo = timeBlocks[hostname];

      if (!blockInfo) {
        return 0;
      }

      const now = Date.now();
      const timeRemaining = blockInfo.timestamp + this.BLOCK_DURATION - now;

      return Math.max(0, timeRemaining);
    }

    /**
     * Format remaining time as MM:SS string
     * @param {number} milliseconds - Time in milliseconds
     * @returns {string} Formatted time string
     */
    static formatTime(milliseconds) {
      const minutes = Math.floor(milliseconds / 60000);
      const seconds = Math.floor((milliseconds % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    /**
     * Clean up all expired time blocks
     * @returns {Promise<void>}
     */
    static async cleanupExpiredBlocks() {
      const timeBlocks = await StorageHelper.getTimeBlocks();
      const now = Date.now();
      let hasChanges = false;

      for (const [hostname, blockInfo] of Object.entries(timeBlocks)) {
        const timeRemaining = blockInfo.timestamp + this.BLOCK_DURATION - now;

        if (timeRemaining <= 0) {
          delete timeBlocks[hostname];
          hasChanges = true;

          // Dispatch event for each removed block
          window.dispatchEvent(
            new CustomEvent("time-block-removed", {
              detail: { hostname },
            })
          );
        }
      }

      if (hasChanges) {
        await StorageHelper.setTimeBlocks(timeBlocks);
      }
    }
  }
  // Export for use in other modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = TimeManager;
  } else {
    window.TimeManager = TimeManager;
  }
}

```
    - background.js (2356 bytes)
      - Content preview:
```
let blockedSites = [];

// Load blocked sites from JSON file
function loadBlockedSites() {
  const sitesUrl = browser.runtime.getURL("sites.json");
  console.log("Loading blocked sites from:", sitesUrl);

  fetch(sitesUrl)
    .then((response) => response.json())
    .then((data) => {
      blockedSites = [...data.blockedSites];
      console.log("Loaded blocked sites:", blockedSites);

      // Store the list for content scripts
      browser.storage.local.set({ blockedSites: blockedSites });
    })
    .catch((error) => {
      console.error("Error loading blocked sites:", error);
    });
}

// Load sites on startup
loadBlockedSites();

// Reload sites on install/update
browser.runtime.onInstalled.addListener(() => {
  console.log("Extension installed/updated - reloading blocked sites");
  loadBlockedSites();
});

// Listen for tab updates to check if site should be blocked
browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url) {
    browser.tabs
      .sendMessage(tabId, {
        action: "checkBlockedSite",
        url: tab.url,
      })
      .catch(() => {
        // Inject content scripts in sequence
        injectContentScripts(tabId, tab.url);
      });
  }
});

// Helper function to inject content scripts
function injectContentScripts(tabId, url) {
  const scripts = [
    "storage-helper.js",
    "time-manager.js",
    "doomscroll-detector.js",
    "doomscroll-animation.js",
    "transition-screen.js",
    "blocking-screen.js",
    "content.js",
  ];

  // Inject scripts sequentially
  scripts
    .reduce((promise, script) => {
      return promise.then(() =>
        browser.tabs.executeScript(tabId, { file: script })
      );
    }, Promise.resolve())
    .then(() => {
      // Try sending the message again after all scripts are injected
      return browser.tabs.sendMessage(tabId, {
        action: "checkBlockedSite",
        url: url,
      });
    })
    .catch((error) => {
      console.log(
        `Could not inject scripts or send message to tab ${tabId}:`,
        error
      );
    });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received request:", request);

  if (request.action === "getBlockedSites") {
    return Promise.resolve({ blockedSites: blockedSites });
  }
});

```
    - content.js (6539 bytes)
      - Content preview:
```
// content.js - Main coordinator for ScrollStop extension modules
// This file orchestrates the interaction between all modules

class ScrollStopCoordinator {
  constructor() {
    this.doomscrollDetector = null;
    this.doomscrollAnimation = null;
    this.transitionScreen = null;
    this.blockingScreen = null;

    this.isInitialized = false;
    this.currentHostname = window.location.hostname;

    // Bind event handlers
    this.handleDoomscrollDetected = this.handleDoomscrollDetected.bind(this);
    this.handleAnimationComplete = this.handleAnimationComplete.bind(this);
    this.handleTransitionComplete = this.handleTransitionComplete.bind(this);
    this.handleTimeBlockRemoved = this.handleTimeBlockRemoved.bind(this);
  }

  /**
   * Initialize the coordinator and set up event listeners
   */
  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      // Set up event listeners for module communication
      this.setupEventListeners();

      // Check if current site should be monitored
      await this.checkCurrentSite();

      this.isInitialized = true;
      console.log("ScrollStop coordinator initialized");
    } catch (error) {
      console.error("Error initializing ScrollStop coordinator:", error);
    }
  }

  /**
   * Set up event listeners for inter-module communication
   */
  setupEventListeners() {
    window.addEventListener(
      "doomscroll-detected",
      this.handleDoomscrollDetected
    );
    window.addEventListener(
      "doomscroll-animation-complete",
      this.handleAnimationComplete
    );
    window.addEventListener(
      "transition-screen-complete",
      this.handleTransitionComplete
    );
    window.addEventListener("time-block-removed", this.handleTimeBlockRemoved);
  }

  /**
   * Check current site and determine what action to take
   */
  async checkCurrentSite() {
    const url = window.location.href;
    const hostname = window.location.hostname;

    try {
      // Check if site is in blocked list
      const isBlocked = await StorageHelper.isCurrentSiteBlocked(url, hostname);

      if (!isBlocked) {
        this.cleanup();
        return;
      }

      // Check if site is currently time-blocked
      const isTimeBlocked = await TimeManager.isTimeBlocked(hostname);

      if (isTimeBlocked) {
        this.showBlockingScreen();
      } else {
        this.startDoomscrollDetection();
      }
    } catch (error) {
      console.error("Error checking current site:", error);
    }
  }

  /**
   * Start doomscroll detection for current site
   */
  startDoomscrollDetection() {
    if (this.doomscrollDetector && this.doomscrollDetector.isActive()) {
      return; // Already active
    }

    this.doomscrollDetector = new DoomscrollDetector({
      scrollLimit: 4000, // Can be made configurable
    });

    this.doomscrollDetector.initialize();
    console.log("Doomscroll detection started for:", this.currentHostname);
  }

  /**
   * Handle doomscroll detection event
   */
  async handleDoomscrollDetected(event) {
    console.log("Doomscroll detected:", event.detail);

    try {
      // Create time block immediately
      await TimeManager.createTimeBlock(this.currentHostname);

      // Start warning animation
      this.doomscrollAnimation = new DoomscrollAnimation({
        flashInterval: 400,
        screenDecayTime: 7,
      });

      await this.doomscrollAnimation.startAnimation();
    } catch (error) {
      console.error("Error handling doomscroll detection:", error);
    }
  }

  /**
   * Handle animation completion event
   */
  handleAnimationComplete(event) {
    console.log("Doomscroll animation complete:", event.detail);

    // Show transition screen
    this.transitionScreen = new TransitionScreen({
      transitionDuration: 3000,
    });

    this.transitionScreen.show();
  }

  /**
   * Handle transition screen completion event
   */
  handleTransitionComplete(event) {
    console.log("Transition screen complete:", event.detail);

    // Show blocking screen
    this.showBlockingScreen();
  }

  /**
   * Show the blocking screen
   */
  showBlockingScreen() {
    this.blockingScreen = new BlockingScreen({
      updateInterval: 1000,
    });

    this.blockingScreen.show();
  }

  /**
   * Handle time block removal event
   */
  handleTimeBlockRemoved(event) {
    if (event.detail.hostname === this.currentHostname) {
      console.log("Time block removed, reloading page");
      window.location.reload();
    }
  }

  /**
   * Clean up all modules and event listeners
   */
  cleanup() {
    // Clean up modules
    if (this.doomscrollDetector) {
      this.doomscrollDetector.destroy();
      this.doomscrollDetector = null;
    }

    if (this.doomscrollAnimation) {
      this.doomscrollAnimation.cleanup();
      this.doomscrollAnimation = null;
    }

    if (this.transitionScreen) {
      this.transitionScreen.cleanup();
      this.transitionScreen = null;
    }

    if (this.blockingScreen) {
      this.blockingScreen.cleanup();
      this.blockingScreen = null;
    }

    // Remove event listeners
    window.removeEventListener(
      "doomscroll-detected",
      this.handleDoomscrollDetected
    );
    window.removeEventListener(
      "doomscroll-animation-complete",
      this.handleAnimationComplete
    );
    window.removeEventListener(
      "transition-screen-complete",
      this.handleTransitionComplete
    );
    window.removeEventListener(
      "time-block-removed",
      this.handleTimeBlockRemoved
    );

    this.isInitialized = false;
  }

  /**
   * Handle messages from background script
   */
  handleMessage(message, sender, sendResponse) {
    if (message.action === "checkBlockedSite") {
      this.checkCurrentSite().then(() => {
        if (sendResponse) {
          sendResponse({ success: true });
        }
      });
      return true; // Indicates async response
    }
  }
}

// Create global coordinator instance
const scrollStopCoordinator = new ScrollStopCoordinator();

// Listen for messages from background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  return scrollStopCoordinator.handleMessage(message, sender, sendResponse);
});

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    scrollStopCoordinator.initialize();
  });
} else {
  // DOM already loaded
  scrollStopCoordinator.initialize();
}

// Also initialize immediately for faster response
scrollStopCoordinator.initialize();

```
    - manifest.json (1158 bytes)
      - Content preview:
```
{
  "manifest_version": 3,
  "default_locale": "en",

  "name": "__MSG_extension_name__",
  "description": "__MSG_extension_description__",
  "version": "1.0",

  "icons": {
    "48": "images/icon-48.png",
    "96": "images/icon-96.png",
    "128": "images/icon-128.png",
    "256": "images/icon-256.png",
    "512": "images/icon-512.png"
  },

  "background": {
    "scripts": ["background.js"],
    "type": "module",
    "persistent": false
  },

  "content_scripts": [
    {
      "js": [
        "storage-helper.js",
        "time-manager.js",
        "doomscroll-detector.js",
        "doomscroll-animation.js",
        "transition-screen.js",
        "blocking-screen.js",
        "content.js"
      ],
      "matches": ["<all_urls>"],
      "run_at": "document_end"
    }
  ],

  "action": {
    "default_popup": "popup.html",
    "default_icon": "images/toolbar-icon.svg"
  },

  "permissions": ["storage", "tabs"],

  "web_accessible_resources": [
    {
      "resources": [
        "sites.json",
        "doomscroll-animation.css",
        "transition-screen.css",
        "blocking-screen.css"
      ],
      "matches": ["<all_urls>"]
    }
  ]
}

```
    - popup.html (397 bytes)
      - Content preview:
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ScrollStop - Blocked Sites</title>
    <link rel="stylesheet" href="popup.css" />
  </head>
  <body>
    <div class="container">
      <h2>ScrollStop</h2>
      <p>Die App läuft im Hintergrund 🗣️🗣️🗣️</p>
  </body>
</html>

```
    - sites.json (251 bytes)
      - Content preview:
```
{
  "blockedSites": [
    "facebook.com",
    "twitter.com",
    "instagram.com",
    "reddit.com",
    "x.com",
    "tiktok.com",
    "youtube.com",
    "linkedin.com",
    "pinterest.com",
    "snapchat.com",
    "tumblr.com",
    "quora.com"
  ]
}

```
  - SafariWebExtensionHandler.swift (1327 bytes)
    - Content preview:
```
//
//  SafariWebExtensionHandler.swift
//  Shared (Extension)
//
//  Created by Oliver Staub on 19.05.2025.
//

import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        let request = context.inputItems.first as? NSExtensionItem

        let profile: UUID?
        if #available(iOS 17.0, macOS 14.0, *) {
            profile = request?.userInfo?[SFExtensionProfileKey] as? UUID
        } else {
            profile = request?.userInfo?["profile"] as? UUID
        }

        let message: Any?
        if #available(iOS 15.0, macOS 11.0, *) {
            message = request?.userInfo?[SFExtensionMessageKey]
        } else {
            message = request?.userInfo?["message"]
        }

        os_log(.default, "Received message from browser.runtime.sendNativeMessage: %@ (profile: %@)", String(describing: message), profile?.uuidString ?? "none")

        let response = NSExtensionItem()
        if #available(iOS 15.0, macOS 11.0, *) {
            response.userInfo = [ SFExtensionMessageKey: [ "echo": message ] ]
        } else {
            response.userInfo = [ "message": [ "echo": message ] ]
        }

        context.completeRequest(returningItems: [ response ], completionHandler: nil)
    }

}

```
- README.md (572 bytes)
  - Content preview:
```
# ScrollStop

This is a Safari Extension to help me stop Doomscrolling.

## How it Works

ScrollStop blocks doomscrolling on social media sites. When you scroll too far on a blocked site, the extension will show a warning and block access to the site for a set period.

## Credits

This Safari extension is adapted from the Chrome extension "Doomscroll Blocker" by Jason Zhang, originally licensed under the Apache License 2.0. The core doomscrolling detection and blocking logic is based on that original work.

Author: Jason Zhang
License: Apache License 2.0
Year: 2024

```

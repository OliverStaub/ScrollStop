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
        self.webView.scrollView.isScrollEnabled = true
        self.webView.scrollView.bounces = true
        self.webView.scrollView.showsVerticalScrollIndicator = true
#endif

        self.webView.configuration.userContentController.add(self, name: "controller")

#if os(iOS)
        loadInitialScreen()
#else
        self.webView.loadFileURL(Bundle.main.url(forResource: "Main", withExtension: "html")!, allowingReadAccessTo: Bundle.main.resourceURL!)
#endif
    }
    
#if os(iOS)
    private func loadInitialScreen() {
        loadScreen("welcome")
    }
    
    private func loadScreen(_ screenName: String) {
        guard let url = Bundle.main.url(forResource: screenName, withExtension: "html") else {
            print("Could not find \(screenName).html")
            return
        }
        self.webView.loadFileURL(url, allowingReadAccessTo: Bundle.main.resourceURL!)
    }
#endif

    // MARK: - WKNavigationDelegate
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
#if os(iOS)
        webView.evaluateJavaScript("initializeApp()")
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

    // MARK: - Navigation Delegate
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        
        guard let url = navigationAction.request.url else {
            decisionHandler(.cancel)
            return
        }
        
        // Handle settings URL scheme to open main iOS Settings
        if url.scheme == "settings" {
#if os(iOS)
            if let settingsURL = URL(string: "App-Prefs:root=SAFARI") {
                // Try to open Safari settings directly
                UIApplication.shared.open(settingsURL) { success in
                    if !success {
                        // Fall back to main Settings app if Safari direct link fails
                        if let mainSettingsURL = URL(string: "App-Prefs:") {
                            UIApplication.shared.open(mainSettingsURL)
                        }
                    }
                }
            }
#endif
            decisionHandler(.cancel)
            return
        }
        
        // For external links, open in default browser
        if !url.isFileURL && (url.scheme == "http" || url.scheme == "https") {
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
        
        // Allow all other navigation
        decisionHandler(.allow)
    }

    // MARK: - WKScriptMessageHandler
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let messageBody = message.body as? String else { return }
        
#if os(iOS)
        switch messageBody {
        case "navigate-to-step1":
            loadScreen("step1")
        case "navigate-to-step2":
            loadScreen("step2")
        case "navigate-to-complete":
            loadScreen("complete")
        case "navigate-to-welcome":
            loadScreen("welcome")
        case "restart-walkthrough":
            loadScreen("welcome")
        default:
            break
        }
#elseif os(macOS)
        if messageBody == "open-preferences" {
            SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
                guard error == nil else {
                    return
                }

                DispatchQueue.main.async {
                    NSApp.terminate(self)
                }
            }
        }
#endif
    }
}
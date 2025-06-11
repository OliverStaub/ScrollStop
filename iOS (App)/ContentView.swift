//
//  ContentView.swift
//  ScrollStop iOS
//
//  Created by Oliver Staub on 19.05.2025.
//

import SwiftUI

struct ContentView: View {
    @State private var currentView: AppView = .home
    @State private var walkthroughStep: WalkthroughStep = .setupStepOne
    
    enum AppView {
        case home
        case walkthrough
        case profile
    }
    
    enum WalkthroughStep {
        case setupStepOne
        case setupStepTwo
        case completion
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                Color(.systemBackground)
                    .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    switch currentView {
                    case .home:
                        HomeMenuView(
                            onStartWalkthrough: {
                                withAnimation(.easeInOut) {
                                    currentView = .walkthrough
                                    walkthroughStep = .setupStepOne
                                }
                            },
                            onSetupProfile: {
                                withAnimation(.easeInOut) {
                                    currentView = .profile
                                }
                            }
                        )
                    case .walkthrough:
                        walkthroughView
                    case .profile:
                        QuestionnaireView(
                            onComplete: {
                                withAnimation(.easeInOut) {
                                    currentView = .home
                                }
                            },
                            onBack: {
                                withAnimation(.easeInOut) {
                                    currentView = .home
                                }
                            }
                        )
                    }
                }
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
        .preferredColorScheme(.light) // Force light mode
    }
    
    @ViewBuilder
    private var walkthroughView: some View {
        switch walkthroughStep {
        case .setupStepOne:
            SetupStepOneView(
                onNext: {
                    withAnimation(.easeInOut) {
                        walkthroughStep = .setupStepTwo
                    }
                },
                onBack: {
                    withAnimation(.easeInOut) {
                        currentView = .home
                    }
                }
            )
        case .setupStepTwo:
            SetupStepTwoView(
                onNext: {
                    withAnimation(.easeInOut) {
                        walkthroughStep = .completion
                    }
                },
                onBack: {
                    withAnimation(.easeInOut) {
                        walkthroughStep = .setupStepOne
                    }
                }
            )
        case .completion:
            CompletionView(onRestart: {
                withAnimation(.easeInOut) {
                    currentView = .home
                }
            })
        }
    }
}

#Preview {
    ContentView()
}
//
//  ContentView.swift
//  ScrollStop iOS
//
//  Created by Oliver Staub on 19.05.2025.
//

import SwiftUI

struct ContentView: View {
    @State private var currentStep: WalkthroughStep = .welcome
    @State private var isWalkthroughCompleted = false
    
    enum WalkthroughStep {
        case welcome
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
                    switch currentStep {
                    case .welcome:
                        WelcomeView(onGetStarted: {
                            withAnimation(.easeInOut) {
                                currentStep = .setupStepOne
                            }
                        })
                    case .setupStepOne:
                        SetupStepOneView(
                            onNext: {
                                withAnimation(.easeInOut) {
                                    currentStep = .setupStepTwo
                                }
                            },
                            onBack: {
                                withAnimation(.easeInOut) {
                                    currentStep = .welcome
                                }
                            }
                        )
                    case .setupStepTwo:
                        SetupStepTwoView(
                            onNext: {
                                withAnimation(.easeInOut) {
                                    currentStep = .completion
                                }
                            },
                            onBack: {
                                withAnimation(.easeInOut) {
                                    currentStep = .setupStepOne
                                }
                            }
                        )
                    case .completion:
                        CompletionView(onRestart: {
                            withAnimation(.easeInOut) {
                                currentStep = .welcome
                            }
                        })
                    }
                }
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
        .onAppear {
            checkWalkthroughStatus()
        }
    }
    
    private func checkWalkthroughStatus() {
        isWalkthroughCompleted = UserDefaults.standard.bool(forKey: "walkthroughCompleted")
        if isWalkthroughCompleted {
            currentStep = .completion
        }
    }
}

#Preview {
    ContentView()
}
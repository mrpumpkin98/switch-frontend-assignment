"use client";

import React, { createContext, useReducer, useEffect, useCallback } from "react";
import axiosInstance from "../lib/axiosInstance";
import { ApiResponse, LoginResponse, UserInfo } from "../types/auth";

// 인증 상태 타입
interface AuthState {
   isAuthenticated: boolean;
   user: UserInfo | null;
   loading: boolean;
   error: string;
}

// AuthContext Props 타입
interface AuthContextProps {
   state: AuthState;
   login: (email: string) => Promise<void>;
   logout: () => void;
}

// 액션 타입
type AuthAction =
   | { type: "SET_LOADING"; payload: boolean }
   | { type: "LOGIN_SUCCESS"; payload: UserInfo }
   | { type: "LOGOUT" }
   | { type: "SET_USER"; payload: UserInfo | null }
   | { type: "SET_ERROR"; payload: string }
   | { type: "CLEAR_ERROR" };

// 초기 상태
const initialState: AuthState = {
   isAuthenticated: false,
   user: null,
   loading: true,
   error: "",
};

// 리듀서
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
   switch (action.type) {
      case "SET_LOADING":
         return { ...state, loading: action.payload };
      case "LOGIN_SUCCESS":
         return {
            ...state,
            isAuthenticated: true,
            user: action.payload,
            loading: false,
            error: "",
         };
      case "LOGOUT":
         return {
            ...state,
            isAuthenticated: false,
            user: null,
            loading: false,
            error: "",
         };
      case "SET_USER":
         return {
            ...state,
            user: action.payload,
            isAuthenticated: !!action.payload,
            loading: false,
            error: "",
         };
      case "SET_ERROR":
         return {
            ...state,
            error: action.payload,
            loading: false,
         };
      case "CLEAR_ERROR":
         return { ...state, error: "" };
      default:
         return state;
   }
};

// 컨텍스트 생성
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

import { CookieManager } from "../utils/cookie";

// 토큰 관리 유틸리티 (쿠키 사용)
const TokenManager = {
   getAccessToken: (): string | null => {
      return CookieManager.get("accessToken");
   },
   setAccessToken: (token: string): void => {
      // 7일간 유효한 쿠키로 저장
      CookieManager.set("accessToken", token, 7);
   },
   removeAccessToken: (): void => {
      CookieManager.remove("accessToken");
   },
};

// AuthProvider 컴포넌트
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [state, dispatch] = useReducer(authReducer, initialState);

   // 로그인
   const login = useCallback(async (email: string) => {
      try {
         dispatch({ type: "SET_LOADING", payload: true });
         dispatch({ type: "CLEAR_ERROR" });

         const response = await axiosInstance.post<ApiResponse<LoginResponse>>("/auth/login", {
            email,
         });

         if (response.data.code === "OK" && response.data.data?.token) {
            const accessToken = response.data.data.token;
            TokenManager.setAccessToken(accessToken);

            // 사용자 정보 설정 (이메일 기반)
            const userInfo: UserInfo = {
               id: email, // 임시로 이메일을 ID로 사용
               email: email,
            };

            dispatch({ type: "LOGIN_SUCCESS", payload: userInfo });
         } else {
            throw new Error(response.data.message || "로그인에 실패했습니다.");
         }
      } catch (error: any) {
         const errorMessage = error.response?.data?.message || error.message || "로그인에 실패했습니다.";
         dispatch({ type: "SET_ERROR", payload: errorMessage });
         throw error;
      }
   }, []);

   // 로그아웃
   const logout = useCallback(() => {
      TokenManager.removeAccessToken();
      dispatch({ type: "LOGOUT" });
   }, []);

   // 초기 로드 시 토큰 확인
   useEffect(() => {
      const initAuth = async () => {
         const accessToken = TokenManager.getAccessToken();
         if (accessToken) {
            // 토큰이 있으면 인증된 것으로 간주
            // 실제로는 토큰 검증 API를 호출해야 할 수 있음
            try {
               // 토큰에서 이메일 추출 (JWT 디코딩) 또는 API 호출
               // 여기서는 간단하게 토큰 존재 여부만 확인
               dispatch({ type: "SET_LOADING", payload: false });
            } catch (error) {
               TokenManager.removeAccessToken();
               dispatch({ type: "LOGOUT" });
            }
         } else {
            dispatch({ type: "SET_LOADING", payload: false });
         }
      };
      initAuth();
   }, []);

   const value: AuthContextProps = {
      state,
      login,
      logout,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

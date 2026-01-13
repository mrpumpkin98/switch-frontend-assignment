import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
   return handleRequest(request, context.params, "GET");
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
   return handleRequest(request, context.params, "POST");
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
   return handleRequest(request, context.params, "PUT");
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
   return handleRequest(request, context.params, "DELETE");
}

async function handleRequest(request: NextRequest, paramsPromise: Promise<{ path: string[] }>, method: string) {
   try {
      const params = await paramsPromise;
      const path = params.path.join("/");
      const url = `${API_BASE_URL}/${path}`;

      // 쿼리 파라미터 가져오기
      const searchParams = request.nextUrl.searchParams;
      const queryString = searchParams.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      // Authorization 헤더 가져오기
      const authHeader = request.headers.get("authorization");

      // 요청 본문 및 Content-Type 처리
      let body: string | URLSearchParams | null = null;
      let contentType = "application/json";

      if (method !== "GET" && method !== "DELETE") {
         // /auth/login 엔드포인트는 form-data 형식 사용
         if (path === "auth/login") {
            try {
               const jsonBody = await request.json();
               // JSON을 form-data 형식으로 변환
               const formData = new URLSearchParams();
               Object.keys(jsonBody).forEach((key) => {
                  formData.append(key, jsonBody[key]);
               });
               body = formData;
               contentType = "application/x-www-form-urlencoded";
            } catch {
               // JSON 파싱 실패 시 빈 본문
            }
         } else {
            // 다른 엔드포인트는 JSON 형식 사용
            try {
               const jsonBody = await request.json();
               body = JSON.stringify(jsonBody);
               contentType = "application/json";
            } catch {
               // JSON이 아닌 경우 빈 본문
            }
         }
      }

      // 외부 API로 요청 전달
      const response = await fetch(fullUrl, {
         method,
         headers: {
            "Content-Type": contentType,
            ...(authHeader && { Authorization: authHeader }),
         },
         ...(body && { body }),
      });

      const data = await response.json();

      return NextResponse.json(data, {
         status: response.status,
      });
   } catch (error: any) {
      return NextResponse.json(
         {
            code: "INTERNAL_ERROR",
            message: error.message || "서버 오류가 발생했습니다.",
            data: null,
         },
         { status: 500 }
      );
   }
}

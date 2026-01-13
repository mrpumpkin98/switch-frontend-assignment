// 쿠키 관리 유틸리티

export const CookieManager = {
   /**
    * 쿠키에서 값 가져오기
    */
   get(name: string): string | null {
      if (typeof window === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
         return parts.pop()?.split(";").shift() || null;
      }
      return null;
   },

   /**
    * 쿠키에 값 설정하기
    */
   set(name: string, value: string, days: number = 7): void {
      if (typeof window === "undefined") return;
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
   },

   /**
    * 쿠키 삭제하기
    */
   remove(name: string): void {
      if (typeof window === "undefined") return;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
   },
};

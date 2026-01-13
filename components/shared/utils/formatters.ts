/**
 * 통화 금액을 포맷팅하는 함수
 * @param amount 금액
 * @param currency 통화 코드 (KRW, USD, JPY 등)
 * @returns 포맷팅된 금액 문자열
 */
export function formatCurrency(amount: number, currency: string): string {
   try {
      return new Intl.NumberFormat("ko-KR", {
         minimumFractionDigits: currency === "KRW" ? 0 : 2,
         maximumFractionDigits: currency === "KRW" ? 0 : 2,
      }).format(amount);
   } catch (error) {
      return new Intl.NumberFormat("ko-KR", {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
      }).format(amount);
   }
}

/**
 * 날짜 문자열을 YYYY-MM-DD HH:MM:SS 형식으로 포맷팅하는 함수
 * @param dateString ISO 날짜 문자열
 * @returns 포맷팅된 날짜 문자열 (YYYY-MM-DD HH:MM:SS)
 */
export function formatDate(dateString: string): string {
   try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
   } catch (error) {
      return dateString;
   }
}


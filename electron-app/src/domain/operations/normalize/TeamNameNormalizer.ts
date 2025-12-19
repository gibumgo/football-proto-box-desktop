/**
 * 팀 이름 정규화 (핸디캡 등 제거)
 * 예: "노팀엄 (1.0)" -> "노팀엄"
 * @param name 원본 팀 이름
 */
export class TeamNameNormalizer {
    static normalize(name: string): string {
        if (!name) return '';
        // 괄호와 괄호 안의 내용 제거 및 앞뒤 공백 제거 (반각/전각 괄호 모두 처리)
        // \uff08: 전각 여는 괄호, \uff09: 전각 닫는 괄호
        return name.replace(/\s*[(\uff08][^)\uff09]*[)\uff09]/g, '').trim();
    }
}

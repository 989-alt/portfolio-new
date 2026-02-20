"use client";

export interface PortfolioZone {
    id: string;
    title: string;
    description: string;
    position: [number, number, number];
    color: string;
    landmark: "hanok" | "bulletin" | "shrine" | "mailbox" | "cherryblossom";
    icon?: string;
}

// 맵 크기: 250x250, 중앙에서 가장자리까지 약 100 units
// 4개 섹터로 나누어 배치 (대각선 강이 맵을 가로지름)
export const PORTFOLIO_ZONES: PortfolioZone[] = [
    {
        id: "about",
        title: "About Me",
        description: "교사로서의 경험과 개발자로서의 비전을 소개합니다.",
        position: [50, 0, -50], // 북동쪽 섹터 (S1) - 한옥집
        color: "#ff9ff3",
        landmark: "hanok",
    },
    {
        id: "project",
        title: "Projects",
        description: "개발자로서 참여한 프로젝트와 대외 활동 기록입니다.",
        position: [-50, 0, -50], // 북서쪽 섹터 (S2) - 게시판
        color: "#54a0ff",
        landmark: "bulletin",
    },
    {
        id: "insight",
        title: "Insights",
        description: "개발 과정에서 배운 지식과 기술 아티클을 정리했습니다.",
        position: [-50, 0, 50], // 남서쪽 섹터 (S3) - 사당
        color: "#feca57",
        landmark: "shrine",
    },
    {
        id: "contact",
        title: "Contact",
        description: "협업 제안이나 문의사항이 있다면 언제든 연락주세요.",
        position: [50, 0, 50], // 남동쪽 섹터 (S4) - 우체통
        color: "#1dd1a1",
        landmark: "mailbox",
    },
];

// 중앙 벚꽃나무 (스폰 포인트 + Welcome 상호작용)
export const HOME_ZONE: PortfolioZone = {
    id: "home",
    title: "Welcome",
    description: "선비의 세계에 오신 것을 환영합니다! 이곳은 저의 포트폴리오 월드입니다.",
    position: [0, 0, 0], // 맵 정중앙
    color: "#ffb8d0",
    landmark: "cherryblossom",
};

// 맵 설정 상수
export const MAP_CONFIG = {
    size: 250,           // 맵 전체 크기
    halfSize: 125,       // 맵 반지름
    zoneRadius: 100,     // 중앙에서 존까지 거리
    pathWidth: 8,        // 길 너비
    riverWidth: 15,      // 강 너비
    forestDensity: 300,  // 나무 개수
};

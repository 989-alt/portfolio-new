🖥️ Project Gravity: PC-Exclusive High-Fidelity World Spec

작성자: Vibe Coder (Commander)
타겟 플랫폼: PC Chrome/Edge (No Mobile Support)
비주얼 목표: Genshin Impact Style (Cel Shading + Post Processing)

1. 프로젝트 방향성 전환 (Pivot Strategy)

모바일 호환성을 제거함에 따라, 성능 제약으로 인해 포기했던 고비용 렌더링 기술을 적극 도입한다.

Poly Count: 씬 당 5만 폴리곤 제한 해제 -> 20만+ 폴리곤 허용.

Lighting: 베이킹(Baking)된 그림자뿐만 아니라, 동적 그림자(Soft Shadows)와 SSAO(공간감을 위한 음영) 적용.

Controls: 터치 인터페이스 제거. 마우스 커서를 잠그는 PointerLockControls 기반의 정통 RPG 조작감 구현.

2. PC 전용 그래픽스 파이프라인 (Visual Stack)

2.1 Advanced Shaders (@Banana 담당)

원신 특유의 "애니메이션 같지만 입체적인" 느낌을 내기 위한 필수 쉐이더 스펙.

Toon Shader with Rim Light:

단순 2단계 톤이 아닌, 부드러운 그라데이션이 들어가는 램프(Ramp) 텍스처 사용.

캐릭터와 지형 가장자리에 역광(Rim Light)을 추가하여 배경과 분리감 형성.

Interactive Grass Shader:

단순히 흔들리는 것을 넘어, 캐릭터가 지나가면 풀이 옆으로 눕는(Displacement) 인터랙션 구현.

Water Shader:

단순 파란 평면이 아닌, Reflection(반사), Refraction(굴절), Foam(거품)이 있는 쉐이더 구현.

2.2 Post-Processing Effects (@Gemini 담당)

PC GPU 자원을 활용하여 화면 때깔을 높이는 후처리 효과 체인.

SSAO (Screen Space Ambient Occlusion): 구석진 곳에 그림자를 더해 지형의 입체감을 극대화. (필수)

Selective Bloom: 광원, 마법 효과 등 특정 밝은 영역만 뽀샤시하게 처리.

SMAA (Subpixel Morphological Antialiasing): 계단 현상 제거를 위해 기본 FXAA보다 무겁지만 품질이 좋은 SMAA 사용.

Depth of Field (DoF): 배경 원경을 흐릿하게 처리하여 캐릭터와 포트폴리오 콘텐츠에 시선 집중.

3. 에셋 및 월드 구성 (World Building)

3.1 Terrain & Environment (@Opus 설계)

Map Structure: '선비의 세계(Seonbi's World)' 컨셉에 맞춘 동양 판타지 무릉도원.

Landscape:

높은 산으로 둘러싸인 분지 형태 (월드 경계 처리 자연스럽게).

중앙에는 거대한 벚꽃 나무(Hero Asset) 배치.

구불구불한 흙길을 따라 포트폴리오 섹션 배치.

Foliage Density:

PC 성능을 믿고 풀(Grass) 인스턴스를 빽빽하게 배치 (약 10,000개 이상).

바람에 날리는 꽃잎 파티클 시스템 추가.

3.2 Controls & Interaction

Camera: OrbitControls 대신 PointerLockControls 사용. 마우스 이동으로 시점을 자유롭게 회전(FPS/TPS 게임 방식).

Keyboard: WASD + Shift(Sprint) + Space(Jump).

UI Interaction: 마우스가 잠겨 있으므로, 상호작용 가능한 객체에 조준점(Crosshair)을 올리고 'E' 키를 눌러 모달을 띄우는 방식.

4. 에이전트 작업 지시서 (Action Plan)

Phase 1: 기반 그래픽 업그레이드

@Gemini: PointerLockControls로 전환하고, @react-three/postprocessing을 설치하여 EffectComposer 파이프라인 구축 (Bloom, SSAO, Vignette).

@Banana: 현재의 Flat Shading을 대체할 CustomToonMaterial 코드 작성.

Phase 2: 월드 리모델링

@Opus: 블렌더 작업 지시서 작성. (지형의 고저차, 물이 흐르는 계곡, 주요 랜드마크 위치 지정).

Developer(User): Opus의 설계에 따라 블렌더에서 지형 모델링 및 GLB Export.

Phase 3: 디테일 및 폴리싱

@Gemini: 대량의 풀(Grass)과 나무(Tree)를 InstancedMesh로 배치하고 바람 쉐이더 적용.

@Sonnet: PC 브라우저(Chrome) 프로파일러를 돌려 드로우 콜(Draw Call) 최적화 체크.
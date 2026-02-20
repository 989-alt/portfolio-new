🏗️ Project: Gravity - 인터랙티브 3D 포트폴리오 개발 계획서

작성자: Vibe Coder (Senior Developer / PO)
문서 버전: 1.2.0 (Agentic Workflow Added)
목표: Bruno Simon 스타일의 물리 기반 인터랙티브 웹 포트폴리오 구축

0. 개발 환경 및 에이전트 오케스트레이션 (DevOps & Agentic Workflow)

이 프로젝트는 단일 개발자가 아닌, 특화된 AI 에이전트 팀에 의해 수행된다. 각 에이전트는 명확한 R&R(Role & Responsibility)을 가지며, 인간(Commander)은 이들의 조율을 담당한다.

0.1 클로드 코드(Claude Code) 실행 환경

Role: 메인 터미널 인터페이스 & 컨텍스트 매니저.

Setup:

Project Root에서 claude 명령어로 실행.

.clauderc 또는 시스템 프롬프트에 현재 프로젝트의 기술 스택(Next.js, R3F, Rapier)을 영구 주입(System Injection).

권한 설정: 파일 생성/수정/삭제 권한 및 로컬 서버(npm run dev) 실행 권한 부여.

0.2 멀티 에이전트 팀 구성 (The Gravity Team)

Codename

Base Model

Role

Responsibility

Opus

Claude 3 Opus

Architect (PM/PL)

기획 구체화, 복잡한 물리 엔진 수식 계산, 컴포넌트 구조 설계, 상태 관리(Zustand) 로직 설계.

Gemini

Gemini 3.0

Frontend Specialist

R3F 캔버스 렌더링, React 컴포넌트 구현, 최신 CSS(Tailwind) 스타일링, 반응형 UI 처리.

Banana

Nano Banana Pro

Visual & Assets

3D 텍스처 생성, 쉐이더(Shader) 코드 작성(GLSL), UI 디자인 에셋 생성, 컬러 팔레트 제안.

Backend

GPT-5.2

System & Data

데이터베이스 스키마(JSON/CMS), API 라우트 최적화, 엣지 펑션(Edge Function) 로직, 보안/인증 처리.

Sonnet

Claude 3.5 Sonnet

QA & Refiner

코드 리뷰, 버그 디버깅, 성능 최적화(Refactoring), 타입스크립트 오류 수정, 마이그레이션.

0.3 오케스트레이션 워크플로우 (Protocol)

Planning (Opus): 요구사항을 분석하여 md 파일로 기술 명세서 작성.

Visualizing (Banana): 필요한 텍스처나 쉐이더 코드를 생성하여 자산화.

Coding (Gemini & Backend): 명세서를 바탕으로 프론트/백엔드 코드 작성.

Review (Sonnet): 작성된 코드를 분석하여 버그 및 비효율적 패턴 수정.

Execution (Claude Code): 최종 코드를 파일 시스템에 적용 및 테스트 실행.

1. 프로젝트 개요 및 핵심 철학

1.1 개요

사용자가 3D 캐릭터(Avatar)를 직접 조작하여 가상 공간을 탐험하며 개발자의 포트폴리오(프로젝트, 경력, 스킬)를 경험하는 게이미피케이션 웹사이트.

1.2 핵심 철학 (Design Philosophy)

Performance First: 60FPS가 나오지 않으면 기능은 의미가 없다. 최적화가 최우선이다.

Accessibility: 3D 조작이 어려운 사용자를 위해 2D UI(HTML Overlay)로도 정보 접근이 가능해야 한다.

Scalability: 포트폴리오 항목이 늘어날 때마다 코드를 뜯어고치지 않고, 데이터(JSON/CMS)만 수정하면 월드에 반영되어야 한다.

2. 기술 스택 선정 (Tech Stack Strategy)

2.1 Core Framework

Next.js (App Router): SEO 최적화 및 초기 로딩 속도 확보. 3D 캔버스 외의 UI 처리에 유리.

React Three Fiber (R3F): Three.js를 React 컴포넌트 방식으로 선언형으로 작성. 유지보수성과 생태계(Drei) 활용을 위해 필수.

2.2 3D & Physics Engine

Physics: Rapier.js (react-three-rapier):

선정 이유: 기존 Cannon.js는 업데이트가 중단되었고 성능이 낮음. Rapier는 Rust 기반(WASM)으로 작동하여 훨씬 빠르고 안정적인 물리 연산을 제공함. 캐릭터 점프/충돌 처리에 필수.

State Management: Zustand:

선정 이유: 3D 렌더링 루프 외부에서 캐릭터 상태(Animation, Position)를 가볍게 관리하기 위함. Redux는 너무 무거움.

Animation: Ecctrl (혹은 커스텀 Kinematic Character Controller):

선정 이유: 물리 엔진 위에서 캐릭터가 미끄러지지 않고 걷/뛰/점프를 자연스럽게 구현하기 위한 리지드바디(RigidBody) 제어 로직.

3. 기능 명세 (Feature Specifications)

3.1 캐릭터 컨트롤러 (Character Controller)

Input System:

PC: WASD / 방향키 + Space(점프) + Shift(달리기).

Mobile: 화면 하단 가상 조이스틱 (Virtual Joystick - nipple.js 등 활용).

Physics Logic:

캐릭터는 Dynamic RigidBody가 아닌 KinematicCharacterController로 구현 권장 (벽 뚫기 방지, 경사로 이동 자연스러움).

점프 시 중력 가속도 적용 및 착지(Grounded) 판정 로직.

Camera Follow:

캐릭터의 움직임을 부드럽게 추적하는 3인칭 카메라 (Damping 적용).

마우스 드래그로 카메라 앵글 회전 가능.

3.2 월드 상호작용 (World Interaction)

포탈/트리거 시스템:

캐릭터가 특정 구역(Zone)이나 객체(PC, 책 등) 근처에 가면 Intersection Event 발생.

상호작용 키(예: 'E')를 누르거나 일정 시간 머물면 모달(Modal) 팝업.

오브젝트 물리학:

단순 장식용 물체(박스, 공)는 충돌 시 튕겨 나가는 물리 효과 적용하여 "살아있는 월드" 느낌 부여.

3.3 포트폴리오 콘텐츠 렌더링

Floating UI (Html from @react-three/drei):

3D 공간 안에 떠 있는 텍스트/이미지 패널.

캐릭터와 거리가 멀어지면 투명도(Opacity) 조절로 시야 확보.

Iframe Monitor:

월드 내 컴퓨터 오브젝트 화면에 실제 웹사이트를 Iframe으로 띄우거나, 스크린샷 텍스처 매핑.

4. 아키텍처 및 최적화 전략 (Architecture & Optimization)

4.1 에셋 파이프라인 (Asset Pipeline)

모델링: Blender 사용. Low-poly 스타일 유지 (Draw call 최소화).

압축: 모든 .glb 파일은 gltf-transform 또는 Draco 압축 필수 적용.

텍스처: 2K 이상 금지. 가능하면 Vertex Color를 사용하여 텍스처 로딩 자체를 배제.

코드 변환: gltfjsx를 사용하여 GLB를 React Component로 변환 후 사용 (직접 로드 지양).

4.2 렌더링 최적화

InstancedMesh: 나무, 울타리, 바닥 타일 등 반복되는 오브젝트는 반드시 인스턴싱 처리하여 Draw call을 1로 줄임.

Baking Shadows: 실시간 그림자(Real-time Shadow)는 캐릭터에게만 적용. 배경 그림자는 블렌더에서 텍스처로 베이킹(Baking)하여 연산 부하 제거.

Performance Monitor: r3f-perf를 장착하여 개발 중 항시 FPS, Memory, Draw Call 모니터링.

5. 단계별 개발 마일스톤 (Milestones)

Phase 1: 기반 구축 (Day 1 Execution)

[ ] 프로젝트 세팅: Next.js + Typescript + Tailwind 설치.

[ ] 라이브러리 설치: three, @react-three/fiber, @react-three/drei, @react-three/rapier, leva, zustand.

[ ] 에셋 파이프라인: Blender 캐릭터 -> .glb export -> gltfjsx로 컴포넌트 변환 (Character.tsx).

[ ] Hello World 3D: 빈 Canvas에 Character.tsx 로드 및 OrbitControls로 확인.

Phase 2: 물리 및 이동 구현 (The Body) - 1~2주차

[ ] Rapier Physics: 바닥(Floor)과 캐릭터에 물리 RigidBody 적용.

[ ] Keyboard Controls: useKeyboardControls(Drei) 혹은 커스텀 훅으로 WASD 입력 매핑.

[ ] Movement Logic: 입력 값에 따라 캐릭터의 Velocity 업데이트 (Kinematic 방식 권장).

[ ] Animation Mapping: 이동 상태(Idle, Walk, Run)에 따라 애니메이션 블렌딩 처리.

Phase 3: 월드 구축 및 인터랙션 (The Soul) - 3~4주차

[ ] Blender로 맵(Map) 모델링 및 Baking.

[ ] 맵 내 구역(About, Skills, Projects, Contact) 배치 및 인스턴싱 최적화.

[ ] 충돌 감지(Collision Detection)를 통한 팝업 UI 구현.

[ ] HTML 오버레이 메뉴 (Skip Navigation) 구현.

Phase 4: 최적화 및 배포 (Polish) - 5주차

[ ] GLB 압축 및 텍스처 최적화.

[ ] 모바일 터치 컨트롤 (Joystick) 구현.

[ ] 로딩 화면(Suspense) 디자인.

[ ] Vercel 배포 및 Lighthouse 점수 점검.

6. 예상 리스크 (Risk Assessment)

카메라 멀미(Motion Sickness): 카메라가 너무 격하게 움직이면 사용자가 어지러움을 느낌. -> 부드러운 Damping 값 튜닝 필수.

초기 로딩 속도: 3D 모델이 많으면 사이트가 뜨는 데 10초 이상 걸릴 수 있음. -> 코드 스플리팅 및 에셋 경량화가 생명.

네비게이션 길 잃음: 사용자가 맵 어디에 있는지 모름. -> 미니맵(Minimap) 혹은 "Reset Position" 버튼 필요.
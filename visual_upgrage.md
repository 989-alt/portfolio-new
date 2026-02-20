🎨 Project Gravity: Visual Fidelity Upgrade Guide

작성자: Vibe Coder
현재 상태: Flat Shading, Low Density (Image 4)
목표 스타일: Stylized RPG, High Density, Baked Lighting (Image 1~3)

1. 아트 파이프라인 변경 (Blender Work)

@Opus와 사용자는 다음 작업을 최우선으로 수행해야 한다.

1.1 Lightmap Baking (필수)

실시간 조명(DirectionalLight)에만 의존하지 않는다. 블렌더 Cycles 엔진을 사용하여 그림자를 텍스처로 굽는다.

Target: 지형(Terrain), 건물, 큰 바위 등 움직이지 않는 정적 오브젝트.

Setting: Sun Strength 5.0, World Background Color (Light Blue).

Output: 2048px 해상도의 Lightmap 텍스처 생성.

R3F 적용: MeshBasicMaterial의 map 속성에 원본 텍스처를, lightMap 속성에 베이킹된 텍스처를 적용.

1.2 Foliage Asset 교체

현재의 Low-poly '사탕' 모양 나무를 폐기한다.

Style: 'Ghibli Style Trees' 또는 'Stylized Alpha Trees'. (나뭇잎이 뭉게구름처럼 표현된 모델)

Grass: 단순한 초록색 바닥이 아니라, 알파 텍스처가 있는 풀 메쉬(Plane)를 준비한다.

2. 쉐이더 및 렌더링 (Code Work)

@Gemini와 @Banana는 다음 기술 스택을 적용한다.

2.1 Post-Processing Chain (EffectComposer)

다음 순서대로 후처리 효과를 적용하여 때깔을 보정한다. (PC 전용)

<EffectComposer disableNormalPass>
  {/* 1. SSAO: 구석진 곳 그림자 (입체감 핵심) */}
  <N8AO halfRes intensity={1.5} color="black" aoRadius={2} />
  
  {/* 2. Bloom: 뽀샤시 효과 */}
  <Bloom luminanceThreshold={1} intensity={0.5} levels={9} mipmapBlur />
  
  {/* 3. Vignette: 가장자리 어둡게 (집중도 향상) */}
  <Vignette eskil={false} offset={0.1} darkness={0.5} />
  
  {/* 4. ToneMapping: 영화 같은 색감 */}
  <ToneMapping mode={THREE.ACESFilmicToneMapping} />
</EffectComposer>


2.2 Toon Shader Material

캐릭터와 동적 오브젝트(움직이는 것)에는 빛 반응형 툰 쉐이더를 적용한다.

Gradient Map: 2단계(밝음/어둠)가 아니라 3~4단계의 부드러운 그라데이션 텍스처를 사용하여 램프 쉐이딩(Ramp Shading) 적용.

Rim Light: 프레넬(Fresnel) 효과를 사용하여 캐릭터 외곽선에 빛을 추가, 배경과 분리시킴.

2.3 Environmental Lighting

Environment: @react-three/drei의 Environment 컴포넌트를 사용, preset="sunset" 또는 preset="park"를 적용하여 자연스러운 반사광(IBL) 추가.

Fog: scene.fog = new THREE.FogExp2('#skyColor', 0.002)를 추가하여 멀리 있는 산이 공기 원근법에 의해 흐려지게 처리.

3. 실행 순서

[Blender] 지형 모델링을 다시 하고 베이킹을 시도한다. (가장 중요)

[Code] R3F 프로젝트에 @react-three/postprocessing을 설치하고 위의 Effect 코드를 넣는다.

[Asset] 무료/유료 'Stylized Nature Pack' (GLTF 포맷)을 구해서 현재의 나무와 교체한다.
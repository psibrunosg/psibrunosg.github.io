import * as THREE from 'three'

interface CloneOptions {
  labelOffsetY?: number
}

interface ClonedGeometry<TMaterial extends THREE.Material> {
  group: THREE.Group
  materials: TMaterial[]
  labelCenter: THREE.Vector3
}

export function cloneGroupsWithMaterials<TMaterial extends THREE.Material>(
  sources: readonly THREE.Group[],
  createMaterial: (mesh: THREE.Mesh) => TMaterial,
  options: CloneOptions = {},
): ClonedGeometry<TMaterial> {
  const group = new THREE.Group()
  const materials: TMaterial[] = []

  sources.forEach((source) => {
    const clone = source.clone(true)

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      const material = createMaterial(child)
      child.material = material
      materials.push(material)
    })

    group.add(clone)
  })

  group.updateMatrixWorld(true)
  const bounds = new THREE.Box3().setFromObject(group)
  const labelCenter = new THREE.Vector3()
  if (!bounds.isEmpty()) bounds.getCenter(labelCenter)
  labelCenter.y += options.labelOffsetY ?? 0

  return { group, materials, labelCenter }
}

export function disposeMaterials(materials: readonly THREE.Material[]): void {
  materials.forEach((material) => material.dispose())
}

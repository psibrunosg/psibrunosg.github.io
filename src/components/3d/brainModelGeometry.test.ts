import { describe, expect, it, vi } from 'vitest'
import * as THREE from 'three'
import {
  cloneGroupsWithMaterials,
  disposeMaterials,
} from './brainModelGeometry'

function createSourceGroup() {
  const source = new THREE.Group()
  source.name = 'source'

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4, 6),
    new THREE.MeshBasicMaterial({ color: '#ff0000' }),
  )
  mesh.name = 'mesh'
  mesh.position.set(4, 6, 8)

  const marker = new THREE.Object3D()
  marker.name = 'marker'

  source.add(mesh, marker)
  source.updateMatrixWorld(true)
  return { source, mesh, marker }
}

describe('cloneGroupsWithMaterials', () => {
  it('clona os grupos sem alterar os objetos de origem', () => {
    const { source, mesh } = createSourceGroup()
    const originalMaterial = mesh.material

    const result = cloneGroupsWithMaterials(
      [source],
      () => new THREE.MeshLambertMaterial({ color: '#00ff00' }),
    )

    expect(result.group).not.toBe(source)
    expect(result.group.getObjectByName('mesh')).not.toBe(mesh)
    expect(mesh.material).toBe(originalMaterial)
    expect(source.parent).toBeNull()
  })

  it('atribui um material explícito a cada Mesh clonado', () => {
    const { source } = createSourceGroup()

    const result = cloneGroupsWithMaterials(
      [source],
      () => new THREE.MeshLambertMaterial({ color: '#00ff00' }),
    )

    const clonedMesh = result.group.getObjectByName('mesh')
    expect(clonedMesh).toBeInstanceOf(THREE.Mesh)
    expect((clonedMesh as THREE.Mesh).material).toBeInstanceOf(
      THREE.MeshLambertMaterial,
    )
    expect(result.materials).toHaveLength(1)
    expect((clonedMesh as THREE.Mesh).material).toBe(result.materials[0])
  })

  it('preserva filhos que não são Mesh', () => {
    const { source, marker } = createSourceGroup()

    const result = cloneGroupsWithMaterials(
      [source],
      () => new THREE.MeshLambertMaterial(),
    )

    const clonedMarker = result.group.getObjectByName('marker')
    expect(clonedMarker).toBeInstanceOf(THREE.Object3D)
    expect(clonedMarker).not.toBe(marker)
  })

  it('calcula um centro estável com deslocamento opcional para o rótulo', () => {
    const { source } = createSourceGroup()

    const result = cloneGroupsWithMaterials(
      [source],
      () => new THREE.MeshLambertMaterial(),
      { labelOffsetY: 20 },
    )

    expect(result.labelCenter.toArray()).toEqual([4, 26, 8])
  })
})

describe('disposeMaterials', () => {
  it('descarta cada material recebido exatamente uma vez', () => {
    const first = new THREE.MeshLambertMaterial()
    const second = new THREE.MeshLambertMaterial()
    const firstDispose = vi.spyOn(first, 'dispose')
    const secondDispose = vi.spyOn(second, 'dispose')

    disposeMaterials([first, second])

    expect(firstDispose).toHaveBeenCalledOnce()
    expect(secondDispose).toHaveBeenCalledOnce()
  })
})

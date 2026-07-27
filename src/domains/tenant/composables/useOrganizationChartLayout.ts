import { type Edge, MarkerType, type Node, useVueFlow } from '@vue-flow/core'
import { type Ref, shallowRef } from 'vue'
import type { IOrganizationUnit } from '../types/organizationUnit.type'

export interface OrganizationUnitNodeData extends IOrganizationUnit {
  level?: number
  children?: Node<OrganizationUnitNodeData>[]
}

const getNodeType = (unit: IOrganizationUnit): 'root' | 'child' | 'technical' => {
  if (unit.isTechnical) {
    return 'technical'
  }
  return unit.parentId ? 'child' : 'root'
}

export function useOrganizationChartLayout(organizationUnits: Ref<IOrganizationUnit[]>) {
  const { onInit } = useVueFlow()

  onInit((vueFlowInstance) => {
    void vueFlowInstance.fitView()
  })

  const unitMap = new Map<string, IOrganizationUnit>()
  // shallowRef: Node<OrganizationUnitNodeData> is recursive; ref() UnwrapRef hits TS2589
  const rootNodes = shallowRef<Node<OrganizationUnitNodeData>[]>([])
  const nodeMap = new Map<string, Node<OrganizationUnitNodeData>>()
  const nodes = shallowRef<Node<OrganizationUnitNodeData>[]>([])
  const edges = shallowRef<Edge[]>([])

  const init = () => {
    unitMap.clear()
    rootNodes.value = []
    nodeMap.clear()
    nodes.value = []
    edges.value = []

    organizationUnits.value.forEach(unit => {
      unitMap.set(unit.id, unit)
    })
  }

  const prepareNodes = () => {
    organizationUnits.value.forEach(unit => {
      const nodeId = unit.id

      const node: Node<OrganizationUnitNodeData> = {
        id: nodeId,
        type: getNodeType(unit),
        label: unit.name,
        position: { x: 0, y: 0 },
        data: {
          ...unit,
          children: [],
        },
      }

      nodeMap.set(nodeId, node)
      nodes.value.push(node)

      const parentNode = unit.parentId ? nodeMap.get(unit.parentId) : null

      if (parentNode) {
        parentNode.data?.children?.push(node)
      }
    })
  }

  const prepareEdges = () => {
    organizationUnits.value.forEach(unit => {
      const nodeId = unit.id
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const node = nodeMap.get(nodeId)!

      if (unit.parentId) {
        const parentId = unit.parentId
        const parentNode = nodeMap.get(parentId)

        if (parentNode && !unit.isTechnical) {
          // Add to parent's children
          parentNode.data?.children?.push(node)

          // Create edge from parent to child
          edges.value.push({
            id: `${parentId}-${nodeId}`,
            source: parentId,
            target: nodeId,
            type: 'smoothstep',
            style: {
              stroke: '#64748b',
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#64748b',
            },
          })
        }
      } else {
        // This is a root node
        rootNodes.value.push(node)
      }
    })
  }

  const prepare = () => {
    prepareNodes()
    prepareEdges()
    calculateHierarchicalLayout(rootNodes.value)
    // shallowRef: array pushes are not tracked — reassign to notify Vue Flow
    nodes.value = nodes.value.slice()
    edges.value = edges.value.slice()
  }

  return {
    init,
    prepare,
    nodes,
    edges,
  }
}

function calculateHierarchicalLayout(rootNodes: Node<OrganizationUnitNodeData>[]) {
  const levelHeight = 250
  const nodeSpacing = 200

  // Assign levels to all nodes
  function assignLevels(nodes: Node<OrganizationUnitNodeData>[], level: number) {
    nodes.forEach(node => {
      if (node.data) {
        node.data.level = node.data.isTechnical ? -1 : level
      }
      if (node.data?.children && node.data.children.length > 0) {
        assignLevels(node.data.children, level + 1)
      }
    })
  }

  rootNodes.forEach(rootNode => { assignLevels([rootNode], 0) })

  // Calculate positions level by level
  const nodesByLevel = new Map<number, Node<OrganizationUnitNodeData>[]>()

  function collectNodesByLevel(nodes: Node<OrganizationUnitNodeData>[]) {
    nodes.forEach(node => {
      const level = node.data?.level ?? 0
      if (!nodesByLevel.has(level)) {
        nodesByLevel.set(level, [])
      }
      nodesByLevel.get(level)?.push(node)

      if (node.data?.children && node.data.children.length > 0) {
        collectNodesByLevel(node.data.children)
      }
    })
  }

  collectNodesByLevel(rootNodes)

  // Position nodes level by level
  nodesByLevel.forEach((levelNodes, level) => {
    const totalWidth = (levelNodes.length - 1) * nodeSpacing
    const startX = -totalWidth / 2

    levelNodes.forEach((node, index) => {
      node.position = {
        x: startX + index * nodeSpacing,
        y: level * levelHeight,
      }
    })
  })

  // Adjust positions to center children under their parent
  function adjustChildPositions(nodes: Node<OrganizationUnitNodeData>[]) {
    nodes.forEach(node => {
      if (node.data?.children && node.data.children.length > 0) {
        // Calculate the center position of children
        const childrenMinX = Math.min(...node.data.children.map(child => child.position.x))
        const childrenMaxX = Math.max(...node.data.children.map(child => child.position.x))
        const childrenCenterX = (childrenMinX + childrenMaxX) / 2

        // Center children under parent
        const offset = node.position.x - childrenCenterX
        node.data.children.forEach(child => {
          child.position.x += offset
        })

        // Recursively adjust grandchildren
        adjustChildPositions(node.data.children)
      }
    })
  }

  adjustChildPositions(rootNodes)
}

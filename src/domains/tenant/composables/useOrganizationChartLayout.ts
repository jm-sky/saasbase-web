import { type Edge, MarkerType, type Node } from '@vue-flow/core'
import { computed, type Ref } from 'vue'
import type { IOrganizationUnit } from '../types/organizationUnit.type'

interface OrganizationNode extends Node<IOrganizationUnit> {
  level?: number
  children?: OrganizationNode[]
}

export function useOrganizationChartLayout(
  organizationUnits: Ref<IOrganizationUnit[]>,
  selectedNodeId: Ref<string | null>
) {
  const nodesAndEdges = computed(() => {
    const nodes: OrganizationNode[] = []
    const edges: Edge[] = []

    // Create a map for quick lookup
    const unitMap = new Map<string, IOrganizationUnit>()
    organizationUnits.value.forEach(unit => {
      unitMap.set(unit.id.toString(), unit)
    })

    // Build hierarchy
    const rootNodes: OrganizationNode[] = []
    const nodeMap = new Map<string, OrganizationNode>()

    // First pass: Create all nodes
    organizationUnits.value.forEach(unit => {
      const nodeId = unit.id.toString()
      const isSelected = selectedNodeId.value === nodeId

      const node: OrganizationNode = {
        id: nodeId,
        type: 'default',
        label: unit.name,
        position: { x: 0, y: 0 },
        data: unit,
        level: 0,
        children: [],
        class: [
          'org-chart-node',
          isSelected && 'org-chart-node--selected'
        ].filter(Boolean).join(' '),
      }

      nodeMap.set(nodeId, node)
      nodes.push(node)
    })

    // Second pass: Build parent-child relationships and create edges
    organizationUnits.value.forEach(unit => {
      const nodeId = unit.id.toString()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const node = nodeMap.get(nodeId)!

      if (unit.parentId) {
        const parentId = unit.parentId.toString()
        const parentNode = nodeMap.get(parentId)

        if (parentNode) {
          // Add to parent's children
          parentNode.children?.push(node)

          // Create edge from parent to child
          edges.push({
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
        rootNodes.push(node)
      }
    })

    // Calculate levels and positions
    calculateHierarchicalLayout(rootNodes)

    return { nodes, edges }
  })

  return {
    nodes: computed(() => nodesAndEdges.value.nodes),
    edges: computed(() => nodesAndEdges.value.edges),
  }
}

function calculateHierarchicalLayout(rootNodes: OrganizationNode[]) {
  const levelHeight = 150
  const nodeSpacing = 200

  // Assign levels to all nodes
  function assignLevels(nodes: OrganizationNode[], level: number) {
    nodes.forEach(node => {
      node.level = level
      if (node.children && node.children.length > 0) {
        assignLevels(node.children, level + 1)
      }
    })
  }

  rootNodes.forEach(rootNode => { assignLevels([rootNode], 0) })

  // Calculate positions level by level
  const nodesByLevel = new Map<number, OrganizationNode[]>()

  function collectNodesByLevel(nodes: OrganizationNode[]) {
    nodes.forEach(node => {
      const level = node.level! // eslint-disable-line @typescript-eslint/no-non-null-assertion
      if (!nodesByLevel.has(level)) {
        nodesByLevel.set(level, [])
      }
      nodesByLevel.get(level)?.push(node)

      if (node.children && node.children.length > 0) {
        collectNodesByLevel(node.children)
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
  function adjustChildPositions(nodes: OrganizationNode[]) {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        // Calculate the center position of children
        const childrenMinX = Math.min(...node.children.map(child => child.position.x))
        const childrenMaxX = Math.max(...node.children.map(child => child.position.x))
        const childrenCenterX = (childrenMinX + childrenMaxX) / 2

        // Center children under parent
        const offset = node.position.x - childrenCenterX
        node.children.forEach(child => {
          child.position.x += offset
        })

        // Recursively adjust grandchildren
        adjustChildPositions(node.children)
      }
    })
  }

  adjustChildPositions(rootNodes)
}

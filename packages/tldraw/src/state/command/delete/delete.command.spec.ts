import { TLDR } from '~state/tldr'
import { TLDrawState } from '~state'
import { mockDocument } from '~test'
import { TLDrawShape, TLDrawShapeType } from '~types'

describe('Delete command', () => {
  const tlstate = new TLDrawState()

  beforeEach(() => {
    tlstate.loadDocument(mockDocument)
  })

  describe('when no shape is selected', () => {
    it('does nothing', () => {
      const initialState = tlstate.state
      tlstate.delete()
      const currentState = tlstate.state

      expect(currentState).toEqual(initialState)
    })
  })

  it('does, undoes and redoes command', () => {
    tlstate.select('rect2')
    tlstate.delete()

    expect(tlstate.getShape('rect2')).toBe(undefined)
    expect(tlstate.getPageState().selectedIds.length).toBe(0)

    tlstate.undo()

    expect(tlstate.getShape('rect2')).toBeTruthy()
    expect(tlstate.getPageState().selectedIds.length).toBe(1)

    tlstate.redo()

    expect(tlstate.getShape('rect2')).toBe(undefined)
    expect(tlstate.getPageState().selectedIds.length).toBe(0)
  })

  it('deletes two shapes', () => {
    tlstate.selectAll()
    tlstate.delete()

    expect(tlstate.getShape('rect1')).toBe(undefined)
    expect(tlstate.getShape('rect2')).toBe(undefined)

    tlstate.undo()

    expect(tlstate.getShape('rect1')).toBeTruthy()
    expect(tlstate.getShape('rect2')).toBeTruthy()

    tlstate.redo()

    expect(tlstate.getShape('rect1')).toBe(undefined)
    expect(tlstate.getShape('rect2')).toBe(undefined)
  })

  it('deletes bound shapes, undoes and redoes', () => {
    const tlstate = new TLDrawState()
      .createShapes(
        { type: TLDrawShapeType.Rectangle, id: 'target1', point: [0, 0], size: [100, 100] },
        { type: TLDrawShapeType.Arrow, id: 'arrow1', point: [200, 200] }
      )
      .select('arrow1')
      .startHandleSession([200, 200], 'start')
      .updateHandleSession([50, 50])
      .completeSession()
      .delete()
      .undo()
  })

  it('deletes bound shapes', () => {
    expect(Object.values(tlstate.page.bindings)[0]).toBe(undefined)

    tlstate
      .deselectAll()
      .createShapes({
        id: 'arrow1',
        type: TLDrawShapeType.Arrow,
      })
      .select('arrow1')
      .startHandleSession([0, 0], 'start')
      .updateHandleSession([110, 110])
      .completeSession()

    const binding = Object.values(tlstate.page.bindings)[0]

    expect(binding).toBeTruthy()
    expect(binding.fromId).toBe('arrow1')
    expect(binding.toId).toBe('rect3')
    expect(binding.meta.handleId).toBe('start')
    expect(tlstate.getShape('arrow1').handles?.start.bindingId).toBe(binding.id)

    tlstate.select('rect3').delete()

    expect(Object.values(tlstate.page.bindings)[0]).toBe(undefined)
    expect(tlstate.getShape('arrow1').handles?.start.bindingId).toBe(undefined)

    tlstate.undo()

    expect(Object.values(tlstate.page.bindings)[0]).toBeTruthy()
    expect(tlstate.getShape('arrow1').handles?.start.bindingId).toBe(binding.id)

    tlstate.redo()

    expect(Object.values(tlstate.page.bindings)[0]).toBe(undefined)
    expect(tlstate.getShape('arrow1').handles?.start.bindingId).toBe(undefined)
  })

  describe('when deleting shapes in a group', () => {
    it('updates the group', () => {
      tlstate.group(['rect1', 'rect2', 'rect3'], 'newGroup').select('rect1').delete()

      expect(tlstate.getShape('rect1')).toBeUndefined()
      expect(tlstate.getShape('newGroup').children).toStrictEqual(['rect2', 'rect3'])
    })
  })

  describe('when deleting a group', () => {
    it('deletes all grouped shapes', () => {
      tlstate.group(['rect1', 'rect2'], 'newGroup').select('newGroup').delete()

      expect(tlstate.getShape('rect1')).toBeUndefined()
      expect(tlstate.getShape('rect2')).toBeUndefined()
      expect(tlstate.getShape('newGroup')).toBeUndefined()
    })
  })

  it.todo('Does not delete uneffected bindings.')
})

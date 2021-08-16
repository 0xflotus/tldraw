import * as React from 'react'
import { ExitIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  FloatingContainer,
  DropdownMenuRoot,
  MenuContent,
  IconButton,
  breakpoints,
  DropdownMenuButton,
  DropdownMenuSubMenu,
  DropdownMenuDivider,
  IconWrapper,
  Kbd,
} from '~components/shared'
import { useTLDrawContext } from '~hooks'
import { Preferences } from './preferences'

export const Menu = React.memo(() => {
  const { tlstate } = useTLDrawContext()

  const handleNew = React.useCallback(() => {
    tlstate.newProject()
  }, [tlstate])

  const handleSave = React.useCallback(() => {
    tlstate.saveProject()
  }, [tlstate])

  const handleLoad = React.useCallback(() => {
    tlstate.loadProject()
  }, [tlstate])

  const toggleDebugMode = React.useCallback(() => {
    tlstate.toggleDebugMode()
  }, [tlstate])

  const handleSignOut = React.useCallback(() => {
    tlstate.signOut()
  }, [tlstate])

  return (
    <FloatingContainer>
      <DropdownMenuRoot>
        <DropdownMenu.Trigger as={IconButton} bp={breakpoints}>
          <HamburgerMenuIcon />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content as={MenuContent} sideOffset={8} align="end">
          <DropdownMenuButton onSelect={handleNew} disabled={true}>
            <span>New Project</span>
            <Kbd variant="menu">#N</Kbd>
          </DropdownMenuButton>
          <DropdownMenuDivider />
          <DropdownMenuButton onSelect={handleLoad}>
            <span>Open...</span>
            <Kbd variant="menu">#L</Kbd>
          </DropdownMenuButton>
          <RecentFiles />
          <DropdownMenuDivider />
          <DropdownMenuButton onSelect={handleSave}>
            <span>Save</span>
            <Kbd variant="menu">#S</Kbd>
          </DropdownMenuButton>
          <DropdownMenuButton onSelect={handleSave}>
            <span>Save As...</span>
            <Kbd variant="menu">⇧#S</Kbd>
          </DropdownMenuButton>
          <DropdownMenuDivider />
          <Preferences />
          <DropdownMenuDivider />
          <DropdownMenuButton onSelect={handleSignOut}>
            <span>Sign Out</span>
            <IconWrapper size="small">
              <ExitIcon />
            </IconWrapper>
          </DropdownMenuButton>
        </DropdownMenu.Content>
      </DropdownMenuRoot>
    </FloatingContainer>
  )
})

function RecentFiles() {
  return (
    <DropdownMenuSubMenu label="Open Recent..." disabled={true}>
      <DropdownMenuButton>
        <span>Project A</span>
      </DropdownMenuButton>
      <DropdownMenuButton>
        <span>Project B</span>
      </DropdownMenuButton>
      <DropdownMenuButton>
        <span>Project C</span>
      </DropdownMenuButton>
    </DropdownMenuSubMenu>
  )
}
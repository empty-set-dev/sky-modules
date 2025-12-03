import globalify from '@sky-modules/core/globalify'

import Brand_Components, * as imports from '../Brand.Components'

declare global {
    const Brand_Components: typeof imports.default
    type Brand_Components = typeof imports.default
    type ButtonVariant = imports.ButtonVariant
    type ButtonSize = imports.ButtonSize
    type InputComponent = imports.InputComponent
    type TextareaComponent = imports.TextareaComponent
    type SelectComponent = imports.SelectComponent
    type CheckboxComponent = imports.CheckboxComponent
    type RadioComponent = imports.RadioComponent
    type SwitchComponent = imports.SwitchComponent
    type CardComponent = imports.CardComponent
    type ComponentSection = imports.ComponentSection
    type ModalComponent = imports.ModalComponent
    type PopoverComponent = imports.PopoverComponent
    type TooltipComponent = imports.TooltipComponent
    type DropdownComponent = imports.DropdownComponent
    type NavbarComponent = imports.NavbarComponent
    type SidebarComponent = imports.SidebarComponent
    type BreadcrumbComponent = imports.BreadcrumbComponent
    type TableComponent = imports.TableComponent
    type AlertComponent = imports.AlertComponent
    type AlertVariant = imports.AlertVariant
    type ToastComponent = imports.ToastComponent
    type ProgressComponent = imports.ProgressComponent
    type SpinnerComponent = imports.SpinnerComponent
    type BadgeComponent = imports.BadgeComponent
    type AvatarComponent = imports.AvatarComponent
    type TabsComponent = imports.TabsComponent
    type PaginationComponent = imports.PaginationComponent
    type ProseComponent = imports.ProseComponent
}

globalify({ Brand_Components })

import {fromJS, List} from "immutable"
import * as Permission from "./Permissions"
import * as Role from "./Roles"

// Roost role permissions
export const PARTICIPANT_PERMISSIONS = []

// Company / Account role permissions
export const USER_PERSMSSIONS = [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_TEMPLATES
]

export const ADMIN_PERMISSIONS = [
    ...USER_PERSMSSIONS,
    Permission.EDIT_TEMPLATES
]

export const OWNER_PERMISSIONS = [
    ...ADMIN_PERMISSIONS,
    Permission.VIEW_BILLING,
    Permission.EDIT_BILLING
]

export const PERMISSIONS_BY_ROLE = fromJS({
    [Role.PARTICIPANT]: PARTICIPANT_PERMISSIONS,
    [Role.USER]: USER_PERSMSSIONS,
    [Role.ADMIN]: ADMIN_PERMISSIONS,
    [Role.OWNER]: OWNER_PERMISSIONS,
})

export const roleHasPermission = (role, permission) => {
    return PERMISSIONS_BY_ROLE.get(role, List([])).contains(permission)
}

import {roleHasPermission} from "./PermissionUtil"
import * as Permission from "./Permissions"
import * as Role from "./Roles"

describe("check permission for role", () => {
    test("User does not have EDIT_BILLING", () => {
        expect(roleHasPermission(Role.USER, Permission.EDIT_BILLING)).toBeFalsy()
    })

    test("User does not have EDIT_TEMPLATES", () => {
        expect(roleHasPermission(Role.USER, Permission.EDIT_TEMPLATES)).toBeFalsy()
    })

    test("USER can see dashbaord", () => {
        expect(roleHasPermission(Role.USER, Permission.VIEW_DASHBOARD)).toBeTruthy()
    })

    test("OWNER can see dashbaord", () => {
        expect(roleHasPermission(Role.OWNER, Permission.VIEW_DASHBOARD)).toBeTruthy()
    })

    test("ADMIN can edit templates", () => {
        expect(roleHasPermission(Role.ADMIN, Permission.EDIT_TEMPLATES)).toBeTruthy()
    })

    test("Unknown role returns false", () => {
        expect(roleHasPermission("NOT_REAL", Permission.EDIT_BILLING)).toBeFalsy()
    })
})

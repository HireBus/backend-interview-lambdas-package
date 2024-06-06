/* eslint-disable no-restricted-syntax */

// TODO: mock each of these imports
import { AUTH_ROLES } from '@core/constants/commons';
import { createKyselyDbConnection, type KyselyClient } from '@core/db/connections';
import { createTestCompaniesUsers } from '@core/services/companies-users/create-test-companies-users';
import {
  createTestCompanies,
  createTestCompany,
} from '@core/services/companies/create-test-company';
import { makeUnauthorizedError } from '@core/services/errors';
import { createTestUser } from '@core/services/users/testing/create-test-users';
import { deleteAllOfTable } from '@core/utils/delete-all-of-table';
import { type ApiEventWithAllData } from 'middlewares/authentication/types-for-authentication';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  companyUsersAuthMiddleware,
  type CompanyIdentifier,
} from './company-users-auth-middleware';

const mocks = vi.hoisted(() => ({
  destroyAllKyselyDbConnections: vi.fn(),
  registerCognitoUser: vi.fn(),
}));

vi.mock('@core/services/cognito/cognito-user-management/register-cognito-user', () => ({
  registerCognitoUser: mocks.registerCognitoUser,
}));

vi.mock('@core/db/utils/kysely-client-pool', async () => {
  const actual = await vi.importActual('@core/db/utils/kysely-client-pool');
  return {
    ...actual,
    destroyAllKyselyDbConnections: mocks.destroyAllKyselyDbConnections,
  };
});

describe('companyUsersAuthMiddleware', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  beforeEach(async () => {
    // TODO refactor this to
    await deleteAllOfTable("hirebus1");
    await deleteAllOfTable("users");
    await deleteAllOfTable("hirebus1c");
    await deleteAllOfTable("companies_users");
    await deleteAllOfTable("companies");
  });

  it('should exist', () => {
    expect(companyUsersAuthMiddleware).toBeDefined();
  });

  runTests();
});

function runTests() {
  const dbClient = createKyselyDbConnection();
  dbClient.preventDestroy();

  async function assertThrowsCompanyNotFoundResponse(companyIdentifier: CompanyIdentifier) {
    await deleteAllOfTable('users');
    await createTestCompany();
    await createTestUser(dbClient, {
      id: 2,
      new_company_id: 1,
    });

    const middlewareArgs = createMockMiddlewareArgs({
      companyIdentifier,
      userId: '1',
      dbClient,
    });

    const fn = async () => companyUsersAuthMiddleware.before(middlewareArgs);

    await expect(fn).rejects.toThrow();
    await expect(fn).rejects.toMatchObject(makeUnauthorizedError('Company not found'));
    expect(mocks.destroyAllKyselyDbConnections).toHaveBeenCalled();
  }

  afterAll(async () => {
    dbClient.allowDestroy();
    await dbClient.destroy();
  });

  it('it should throw company not found response', async () => {
    const companyIdentifiers: CompanyIdentifier[] = [
      {
        keyName: 'companyId',
        value: '5',
      },
      {
        keyName: 'company_id',
        value: '5',
      },
    ];

    for (const companyIdentifier of companyIdentifiers) {
      await assertThrowsCompanyNotFoundResponse(companyIdentifier);
    }
  });

  async function assertThrowsUserNotFoundResponse(
    companyIdentifier: CompanyIdentifier,
    realCompanyName: string
  ) {
    await deleteAllOfTable('users');
    await createTestCompany({
      id: 1,
      name: realCompanyName,
    });
    await createTestUser(dbClient, {
      id: 2,
    });

    const middlewareArgs = createMockMiddlewareArgs({
      companyIdentifier,
      userId: '32',
      dbClient: createKyselyDbConnection(),
    });

    const fn = async () => {
      await companyUsersAuthMiddleware.before(middlewareArgs);
    };

    await expect(fn).rejects.toThrow();
    await expect(fn).rejects.toMatchObject(makeUnauthorizedError('User not found'));
    expect(mocks.destroyAllKyselyDbConnections).toHaveBeenCalled();
    expect(mocks.destroyAllKyselyDbConnections).toHaveBeenCalled();
  }

  it.each([
    {
      keyName: 'companyId',
      value: '1',
    },
    {
      keyName: 'company_id',
      value: '1',
    },
    {
      keyName: 'company',
      value: 'Billy Co',
    },
    {
      keyName: 'companyName',
      value: 'Billy Co',
    },
  ] as CompanyIdentifier[])(
    'should throw user not found response when using $keyName as the identifier',
    async companyIdentifier => {
      const realCompanyName = 'Billy Co';

      await assertThrowsUserNotFoundResponse(companyIdentifier, realCompanyName);
    }
  );

  async function assertThrowsUserNotPartOfCompanyResponse(
    realCompanyName: string,
    companyIdentifier: CompanyIdentifier
  ) {
    await deleteAllOfTable('users');
    await createTestCompany({
      name: realCompanyName,
    });
    await createTestCompany();
    await createTestUser(dbClient, {
      new_company_id: 2,
    });

    const middlewareArgs = createMockMiddlewareArgs({
      companyIdentifier,
      userId: '1',
      dbClient: createKyselyDbConnection(),
    });

    const fn = async () => companyUsersAuthMiddleware.before(middlewareArgs);

    await expect(fn).rejects.toThrow();
    await expect(fn).rejects.toMatchObject(
      makeUnauthorizedError('Requesting user is not a member of the requested company')
    );
    expect(mocks.destroyAllKyselyDbConnections).toHaveBeenCalled();
  }

  it.each([
    {
      keyName: 'companyId',
      value: '1',
    },
    {
      keyName: 'company_id',
      value: '1',
    },
    {
      keyName: 'company',
      value: 'Random Company',
    },
    {
      keyName: 'companyName',
      value: 'Random Company',
    },
  ] as CompanyIdentifier[])(
    'should throw "Requesting user is not a member of the requested company" error when using $keyName as the identifier',
    async companyIdentifier => {
      const realCompanyName = 'Random Company';

      await assertThrowsUserNotPartOfCompanyResponse(realCompanyName, companyIdentifier);
    }
  );

  it('should not throw an error if the user belongs to the company', async () => {
    const companyName = 'Best Socks Company';

    const companyIdentifiers: CompanyIdentifier[] = [
      {
        keyName: 'companyId',
        value: '1',
      },
      {
        keyName: 'company_id',
        value: '1',
      },
      {
        keyName: 'company',
        value: companyName,
      },
      {
        keyName: 'companyName',
        value: companyName,
      },
    ];

    for (const companyIdentifier of companyIdentifiers) {
      await deleteAllOfTable('users');
      await deleteAllOfTable('companies');

      await createTestCompany({
        name: companyName,
      });
      await createTestUser(dbClient, {
        new_company_id: 1,
      });

      const middlewareArgs = createMockMiddlewareArgs({
        companyIdentifier,
        userId: '1',
        dbClient: createKyselyDbConnection(),
      });

      const fn = async () => companyUsersAuthMiddleware.before(middlewareArgs);

      await fn();
    }

    expect(mocks.destroyAllKyselyDbConnections).not.toHaveBeenCalled();
  });

  async function assertNoErrorForSuperAdmin(
    realCompanyName: string,
    companyIdentifier: CompanyIdentifier
  ) {
    await deleteAllOfTable('users');
    await createTestCompany({
      name: realCompanyName,
    });
    await createTestUser(dbClient, {
      company_id: null,
      auth_role: 'SUPER_ADMIN',
    });

    const middlewareArgs = createMockMiddlewareArgs({
      companyIdentifier,
      userId: '1',
      dbClient: createKyselyDbConnection(),
    });

    const fn = async () => companyUsersAuthMiddleware.before(middlewareArgs);

    await fn();
    expect(mocks.destroyAllKyselyDbConnections).not.toHaveBeenCalled();
  }

  it('should not throw if the user is a super admin, even if the user does not belong to the company', async () => {
    const realCompanyName = 'Potatoes for Days';

    const companyIdentifiers: CompanyIdentifier[] = [
      {
        keyName: 'companyId',
        value: '1',
      },
      {
        keyName: 'company_id',
        value: '1',
      },
      {
        keyName: 'company',
        value: realCompanyName,
      },
      {
        keyName: 'companyName',
        value: realCompanyName,
      },
    ];

    for (const companyIdentifier of companyIdentifiers) {
      await assertNoErrorForSuperAdmin(realCompanyName, companyIdentifier);
    }
  });

  it('should not throw if the company id is one of the child companies of the user', async () => {
    const parentCompanyName = 'Parent company';
    const childCompanyName = 'Child company';

    await createTestCompany({
      name: parentCompanyName,
    });

    await createTestCompany({
      name: childCompanyName,
      parent_company_id: 1,
    });

    await createTestUser(dbClient, {
      new_company_id: 1,
    });

    const middlewareArgs = createMockMiddlewareArgs({
      userId: '1',
      dbClient,
      companyIdentifier: {
        keyName: 'company_id',
        value: '2',
      },
    });

    await companyUsersAuthMiddleware.before(middlewareArgs);
  });

  it('should throw an error if one of the companies listed or children companies does not belong to the user', async () => {
    await createTestCompany(); // id 3

    await createTestCompanies([
      { id: 2, parent_company_id: 1 }, // id 2
      { id: 3 }, // id 3
      { id: 4 }, // id 4
    ]);

    await createTestCompany({
      parent_company_id: 2,
    }); // id 5

    await createTestUser(dbClient, {
      new_company_id: 1,
    });

    await createTestCompaniesUsers(dbClient, [
      {
        company_id: 3,
        user_id: 1,
      },
    ]);

    const middlewareArgs = createMockMiddlewareArgs({
      userId: '1',
      dbClient,
      companyIdentifier: {
        keyName: 'companyIds',
        value: [1, 2, 3, 4],
      },
    });

    const fn = async () => companyUsersAuthMiddleware.before(middlewareArgs);

    await expect(fn).rejects.toThrow();
    await expect(fn).rejects.toMatchObject(
      makeUnauthorizedError('At least one company requested does not belong to user')
    );
    expect(mocks.destroyAllKyselyDbConnections).toHaveBeenCalled();
  });

  it('should not throw an error if the franchise owner is requesting just his/her own company', async () => {
    const parentCompanyName = 'Parent company';
    const childCompanyName = 'Child company';

    await createTestCompany({
      name: parentCompanyName,
    });

    await createTestCompany({
      name: childCompanyName,
      parent_company_id: 1,
    });

    await createTestUser(dbClient, {
      id: 1,
      new_company_id: 1,
      auth_role: AUTH_ROLES.FRANCHISE_OWNER,
    });

    const middlewareArgs = createMockMiddlewareArgs({
      userId: '1',
      dbClient,
      companyIdentifier: {
        keyName: 'company',
        value: parentCompanyName,
      },
    });

    await companyUsersAuthMiddleware.before(middlewareArgs);
    expect(mocks.destroyAllKyselyDbConnections).not.toHaveBeenCalled();
  });

  it('should not throw if company user is part of company', async () => {
    await createTestCompany();
    await createTestUser(dbClient, {
      auth_role: AUTH_ROLES.COMPANY_OWNER,
      new_company_id: 1,
    });

    const middlewareArgs = createMockMiddlewareArgs({
      userId: '1',
      dbClient,
      companyIdentifier: {
        keyName: 'company_id',
        value: '1',
      },
    });

    await companyUsersAuthMiddleware.before(middlewareArgs);
    expect(mocks.destroyAllKyselyDbConnections).not.toHaveBeenCalled();
  });

  it.each([
    { authRole: AUTH_ROLES.COMPANY_OWNER, identifier: 'companyIds' },
    { authRole: AUTH_ROLES.COMPANY_OWNER, identifier: 'company_ids' },
    { authRole: AUTH_ROLES.COMPANY_USER, identifier: 'companyIds' },
    { authRole: AUTH_ROLES.COMPANY_USER, identifier: 'company_ids' },
  ])(
    'should allow for identifier $identifier for auth role $authRole',
    async ({ authRole, identifier }) => {
      await createTestCompany();
      await createTestUser(dbClient, {
        auth_role: authRole,
        new_company_id: 1,
      });

      const middlewareArgs = createMockMiddlewareArgs({
        userId: '1',
        dbClient,
        companyIdentifier: {
          keyName: identifier,
          value: ['1'],
        },
      });

      await companyUsersAuthMiddleware.before(middlewareArgs);
      expect(mocks.destroyAllKyselyDbConnections).not.toHaveBeenCalled();
    }
  );

  it('should allow for non-super admin to request for multiple companies', async () => {
    await createTestCompany(); // id 3

    await createTestCompanies([
      { id: 2, parent_company_id: 1 }, // id 2
      { id: 3 }, // id 3
      { id: 4 }, // id 4
    ]);

    await createTestCompany({
      parent_company_id: 2,
    }); // id 5

    await createTestUser(dbClient, {
      new_company_id: 1,
    });

    await createTestCompaniesUsers(dbClient, [
      {
        company_id: 3,
        user_id: 1,
      },
      {
        company_id: 4,
        user_id: 1,
      },
    ]);

    const middlewareArgs = createMockMiddlewareArgs({
      userId: '1',
      dbClient,
      companyIdentifier: {
        keyName: 'companyIds',
        value: [1, 2, 3, 4, 5],
      },
    });

    await expect(companyUsersAuthMiddleware.before(middlewareArgs)).resolves.not.toThrow();
  });
}

function createMockMiddlewareArgs({
  userId,
  dbClient,
  companyIdentifier,
}: {
  userId: string;
  dbClient: KyselyClient;
  companyIdentifier: {
    keyName: string;
    value: string | string[] | number[];
  };
}) {
  return {
    event: {
      idTokenData: {
        email: 'bob@rick.com',
        userId,
      },
      dbClient,
      body: {
        [companyIdentifier.keyName]: companyIdentifier.value,
      },
    } as ApiEventWithAllData,
  };
}

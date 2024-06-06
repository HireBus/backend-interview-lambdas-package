import { type KyselyClient } from '@core/db/connections';
import { fetchCompany } from '@core/services/companies/fetch-company';
import { makeUnauthorizedError } from '@core/services/errors';
import { fetchUser } from '@core/services/users/fetch-user';
import { type Company } from '@core/types/company';
import { type User } from '@core/types/user';
import { type ApiEventWithAllData } from 'middlewares/authentication/types-for-authentication';
import {
  makeMiddlewareCompliant,
  type MiddlewareGeneralType,
} from 'middlewares/utils/make-middleware-compliant';
import { type AuthMiddleware } from '../auth-middleware-type';

export type CompanyIdentifierKeyName =
  | 'companyId'
  | 'company_id'
  | 'company'
  | 'companyName'
  | 'companyIds'
  | 'company_ids';

export type CompanyIdentifier = {
  keyName: CompanyIdentifierKeyName;
  value: string;
};

export const companyUsersAuthMiddleware = makeMiddlewareCompliant({
  // TODO: pull the user from event
  before: async ({ event }: { event: ApiEventWithAllData }) => {
    const user = await fetchUser({
      dbClient: event.dbClient,
      userId: Number(event.idTokenData.userId),
    });

    assertUserExists(user);

    if (user.auth_role === 'SUPER_ADMIN' || event.idTokenData.superAdminId) {
      return;
    }

    const requestedCompanyIds = getRequestedCompanyIds(event);

    if (requestedCompanyIds) {
      assertUserHasAccessToRequestedCompanyIds(user, requestedCompanyIds);

      return;
    }

    const company = await fetchCompanyToCheck(event.body, event.dbClient);

    assertCompanyExists(company);

    if (user.auth_role === 'FRANCHISE_OWNER') {
      assertCompanyBelongsToFranchiseOwner(user, company);
    }

    assertUserBelongsToCompany(user, company);
  },
} as MiddlewareGeneralType) as AuthMiddleware;

function getRequestedCompanyIds(event: ApiEventWithAllData) {
  const requestedIds = event.body.companyIds || event.body.company_ids;

  if (!requestedIds) return undefined;

  if (!Array.isArray(requestedIds)) {
    throw new Error('companyIds or company_ids must be an array');
  }

  return (requestedIds as string[] | number[]).map(id => Number(id)).filter(Boolean);
}

function assertUserHasAccessToRequestedCompanyIds(user: User, requestedCompanyIds: number[]) {
  const userCompanies = user.companies ?? [];

  const userCompanyIds = userCompanies.map(company => company.id);
  if (
    !requestedCompanyIds.every(requestedCompanyId =>
      userCompanyIds.some(companyId => companyId === requestedCompanyId)
    )
  ) {
    throw makeUnauthorizedError('At least one company requested does not belong to user');
  }
}

function assertUserBelongsToCompany(user: User, company: Company) {
  if (user?.company?.id !== company.id && user.company?.id !== company.parent_company_id)
    throw makeUnauthorizedError('Requesting user is not a member of the requested company');
}

function assertCompanyBelongsToFranchiseOwner(user: User, company: Company): void {
  if (company.id === user.company?.id) return;

  const companies = user.legacyCompany?.companies?.split(',') ?? [];

  if (!companies?.some(franchisee => franchisee === company.name))
    throw makeUnauthorizedError('Franchise owner does not have access to this company');
}

function assertCompanyExists(company: Company | undefined): asserts company is Company {
  if (!company) {
    throw makeUnauthorizedError('Company not found');
  }
}

function assertUserExists(user: User | undefined): asserts user is User {
  if (!user) throw makeUnauthorizedError('User not found');
}

async function fetchCompanyToCheck(body: Record<string, unknown>, dbClient: KyselyClient) {
  const companyId = getCompanyIdFromBody(body);

  const companyName = getCompanyNameFromBody(body);

  const company = await fetchCompany({
    dbClient,
    companyId: Number(companyId),
    companyName,
  });
  return company;
}

function getCompanyIdFromBody(body: Record<CompanyIdentifierKeyName, unknown>) {
  let companyIdentifierKeyName;

  if (body.companyId) {
    companyIdentifierKeyName = body.companyId;
  }
  if (body.company_id) {
    companyIdentifierKeyName = body.company_id;
  }
  if (body.companyIds) {
    companyIdentifierKeyName = body.companyIds;
  }
  if (body.company_ids) {
    companyIdentifierKeyName = body.company_ids;
  }

  return companyIdentifierKeyName;
}

function getCompanyNameFromBody(body: Record<CompanyIdentifierKeyName, unknown>): string {
  let companyIdentifierKeyName;

  if (body.company) {
    companyIdentifierKeyName = body.company;
  }
  if (body.companyName) {
    companyIdentifierKeyName = body.companyName;
  }

  return (companyIdentifierKeyName as string) ?? 'unknown';
}

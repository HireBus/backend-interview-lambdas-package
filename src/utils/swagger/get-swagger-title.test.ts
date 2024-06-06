import { describe, expect, it } from 'vitest';
import { getSwaggerTitle } from './get-swagger-title';

describe(getSwaggerTitle.name, () => {
  it('should return "Dev API - {projectName}" for dev', () => {
    const hirebusResult = getSwaggerTitle({ stage: 'dev', projectName: 'HireBus' });
    const beResult = getSwaggerTitle({ stage: 'dev', projectName: 'Behavioral Essentials' });

    expect(hirebusResult).toMatchInlineSnapshot(`"Dev API - HireBus"`);
    expect(beResult).toMatchInlineSnapshot(`"Dev API - Behavioral Essentials"`);
  });

  it('should return "Staging API - {projectName}" for staging', () => {
    const hirebusResult = getSwaggerTitle({ stage: 'staging', projectName: 'HireBus' });
    const beResult = getSwaggerTitle({ stage: 'staging', projectName: 'Behavioral Essentials' });

    expect(hirebusResult).toMatchInlineSnapshot(`"Staging API - HireBus"`);
    expect(beResult).toMatchInlineSnapshot(`"Staging API - Behavioral Essentials"`);
  });

  it('should return "Prod API - {projectName}" for prod', () => {
    const hirebusResult = getSwaggerTitle({ stage: 'prod', projectName: 'HireBus' });
    const beResult = getSwaggerTitle({ stage: 'prod', projectName: 'Behavioral Essentials' });

    expect(hirebusResult).toMatchInlineSnapshot(`"Prod API - HireBus"`);
    expect(beResult).toMatchInlineSnapshot(`"Prod API - Behavioral Essentials"`);
  });
});

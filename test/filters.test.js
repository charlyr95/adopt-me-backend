import { expect } from 'chai';
import { caseInsensitiveMatch, toMongoFilters } from '../src/utils/filters.js';

describe('filters.js - utilidades de filtrado case-insensitive', () => {
  // ─── caseInsensitiveMatch ───────────────────────────────────────────

  describe('caseInsensitiveMatch', () => {
    it('coincide strings ignorando mayúsculas/minúsculas', () => {
      expect(caseInsensitiveMatch('Cat', 'cat')).to.be.true;
      expect(caseInsensitiveMatch('cat', 'CAT')).to.be.true;
      expect(caseInsensitiveMatch('Dog', 'dog')).to.be.true;
    });

    it('no coincide strings distintos', () => {
      expect(caseInsensitiveMatch('cat', 'dog')).to.be.false;
    });

    it('coincide strings exactamente iguales', () => {
      expect(caseInsensitiveMatch('available', 'available')).to.be.true;
    });

    it('compara valores no-string con igualdad estricta', () => {
      expect(caseInsensitiveMatch(3, 3)).to.be.true;
      expect(caseInsensitiveMatch(3, '3')).to.be.false;
      expect(caseInsensitiveMatch(null, null)).to.be.true;
      expect(caseInsensitiveMatch(true, true)).to.be.true;
      expect(caseInsensitiveMatch(true, 'true')).to.be.false;
    });

    it('retorna false cuando uno es string y el otro no', () => {
      expect(caseInsensitiveMatch(123, 'cat')).to.be.false;
      expect(caseInsensitiveMatch('cat', 123)).to.be.false;
    });
  });

  // ─── toMongoFilters ────────────────────────────────────────────────

  describe('toMongoFilters', () => {
    it('convierte strings a regex case-insensitive', () => {
      const result = toMongoFilters({ species: 'Cat' });
      expect(result.species).to.be.instanceOf(RegExp);
      expect(result.species.flags).to.include('i');
      expect(result.species.test('cat')).to.be.true;
      expect(result.species.test('Cat')).to.be.true;
      expect(result.species.test('CAT')).to.be.true;
      expect(result.species.test('dog')).to.be.false;
    });

    it('la regex es anclada — no hace match parcial', () => {
      const result = toMongoFilters({ name: 'mi' });
      expect(result.name.test('milo')).to.be.false;
      expect(result.name.test('mi')).to.be.true;
    });

    it('convierte strings numéricos a Number', () => {
      const result = toMongoFilters({ age: '3' });
      expect(result.age).to.equal(3);
      expect(result.age).to.be.a('number');
    });

    it('convierte "0" a 0 (no lo trata como string)', () => {
      const result = toMongoFilters({ age: '0' });
      expect(result.age).to.equal(0);
    });

    it('deja ObjectId-like strings sin transformar', () => {
      const oid = '507f1f77bcf86cd799439011';
      const result = toMongoFilters({ owner: oid });
      expect(result.owner).to.equal(oid);
      expect(result.owner).to.be.a('string');
    });

    it('deja valores no-string sin transformar', () => {
      const result = toMongoFilters({ age: 5, active: true });
      expect(result.age).to.equal(5);
      expect(result.active).to.equal(true);
    });

    it('maneja strings vacíos sin convertir a número', () => {
      const result = toMongoFilters({ name: '' });
      expect(result.name).to.be.instanceOf(RegExp);
    });

    it('escapa caracteres especiales de regex en el valor', () => {
      const result = toMongoFilters({ name: 'Mr. Whiskers (cat)' });
      expect(result.name).to.be.instanceOf(RegExp);
      expect(result.name.test('Mr. Whiskers (cat)')).to.be.true;
      expect(result.name.test('MrX Whiskers Xcat)')).to.be.false;
    });

    it('maneja múltiples filtros simultáneamente', () => {
      const result = toMongoFilters({
        species: 'Dog',
        status: 'available',
        age: '2',
        owner: '507f1f77bcf86cd799439011'
      });

      expect(result.species).to.be.instanceOf(RegExp);
      expect(result.species.test('dog')).to.be.true;
      expect(result.status).to.be.instanceOf(RegExp);
      expect(result.status.test('Available')).to.be.true;
      expect(result.age).to.equal(2);
      expect(result.owner).to.equal('507f1f77bcf86cd799439011');
    });

    it('retorna objeto vacío cuando los filtros están vacíos', () => {
      const result = toMongoFilters({});
      expect(result).to.deep.equal({});
    });
  });
});

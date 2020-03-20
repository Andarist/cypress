/**
 * This tests various failure scenarios where an error and code frame is displayed
 * It does this by having a test fail and then a subsequent test run that
 * tests the appearance of the command log
 * Because of this, the test order is important
 * There should be the same number of failing tests as there are passing
 * tests, because each failure has a verification test (e.g. 11 fail, 11 pass)
 */
import outsideError from '../../../todos/throws-error'
import { fail, verify } from '../support/util'

describe('assertion failure', function () {
  fail(this, () => {
    expect(true).to.be.false
    expect(false).to.be.false
  })

  verify(this, {
    column: 5,
    message: 'expected true to be false',
  })
})

context('exceptions', function () {
  describe('in spec file', function () {
    fail(this, () => {
      ({}).bar()
    })

    verify(this, {
      column: 12,
      message: 'bar is not a function',
    })
  })

  describe('in file outside project', function () {
    fail(this, () => {
      outsideError()
    })

    verify(this, {
      message: 'An outside error',
      regex: /todos\/throws\-error\.js:5:9/,
      codeFrameText: `thrownewError('An outside error')`,
    })
  })
})

context('commands', function () {
  describe('failure', function () {
    fail(this, () => {
      cy.get('h1', { timeout: 1 })
    })

    verify(this, {
      column: 10,
      message: 'Timed out retrying: Expected to find element: h1, but never found it',
    })
  })

  describe('chained failure', function () {
    fail(this, () => {
      cy.get('div').find('h1', { timeout: 1 })
    })

    verify(this, {
      column: 21,
      message: 'Timed out retrying: Expected to find element: h1, but never found it',
    })
  })
})

describe('cy.then', function () {
  describe('assertion failure', function () {
    fail(this, () => {
      cy.wrap({}).then(() => {
        expect(true).to.be.false
      })
    })

    verify(this, {
      column: 9,
      message: 'expected true to be false',
    })
  })

  describe('exception', function () {
    fail(this, () => {
      cy.wrap({}).then(() => {
        ({}).bar()
      })
    })

    verify(this, {
      column: 14,
      message: 'bar is not a function',
    })
  })

  describe('command failure', function () {
    fail(this, () => {
      cy.wrap({}).then(() => {
        cy.get('h1', { timeout: 1 })
      })
    })

    verify(this, {
      column: 12,
      message: 'Timed out retrying: Expected to find element: h1, but never found it',
    })
  })
})

describe('cy.should', function () {
  describe('callback assertion failure', function () {
    fail(this, () => {
      cy.wrap({}).should(() => {
        expect(true).to.be.false
      })
    })

    verify(this, {
      column: 9,
      message: 'expected true to be false',
    })
  })

  describe('callback exception', function () {
    fail(this, () => {
      cy.wrap({}).should(() => {
        ({}).bar()
      })
    })

    verify(this, {
      column: 14,
      message: 'bar is not a function',
    })
  })

  describe('assertion failure', function () {
    fail(this, () => {
      cy.wrap({})
      .should('have.property', 'foo')
    })

    verify(this, {
      column: 8,
      message: 'Timed out retrying: expected {} to have property \'foo\'',
    })
  })

  describe('after multiple', function () {
    fail(this, () => {
      cy.wrap({ foo: 'foo' }).should('have.property', 'foo')
      .should('equal', 'bar')
    })

    verify(this, {
      column: 8,
      message: 'Timed out retrying: expected \'foo\' to equal \'bar\'',
    })
  })

  describe('after multiple callbacks exception', function () {
    fail(this, () => {
      cy.wrap({ foo: 'foo' })
      .should(() => {
        expect(true).to.be.true
      })
      .should(() => {
        ({}).bar()
      })
    })

    verify(this, {
      column: 14,
      codeFrameText: '({}).bar()',
      message: 'bar is not a function',
    })
  })

  describe('after multiple callbacks assertion failure', function () {
    fail(this, () => {
      cy.wrap({ foo: 'foo' })
      .should(() => {
        expect(true).to.be.true
      })
      .should(() => {
        expect(true).to.be.false
      })
    })

    verify(this, {
      column: 9,
      codeFrameText: '.should(()=>',
      message: 'expected true to be false',
    })
  })

  describe('command after success', function () {
    fail(this, () => {
      cy.wrap({ foo: 'foo' }).should('have.property', 'foo')
      cy.get('h1', { timeout: 1 })
    })

    verify(this, {
      column: 10,
      message: 'Timed out retrying: Expected to find element: h1, but never found it',
    })
  })
})

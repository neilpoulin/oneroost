import * as immutableMatchers from "jest-immutable-matchers"

// toBeImmutable
// toBeIterableImmutable
// toBeKeyedImmutable
// toBeIndexedImmutable
// toBeAssociativeImmutable
// toBeOrderedImmutable
// toBeImmutableList
// toBeImmutableMap
// toBeImmutableOrderedMap
// toBeImmutableSet
// toBeImmutableOrderedSet
// toBeImmutableStack
// toBeImmutableSeq
// toEqualImmutable

beforeEach(function () {
    jest.addMatchers(immutableMatchers);
});

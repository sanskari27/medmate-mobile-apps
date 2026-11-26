import { addressFixture } from '../../../../test/address-fixture';
import {
  deliversHere,
  emptyDraft,
  startingPin,
  toAddressInput,
  validateAddress,
  type AddressDraft,
} from './address-form';
import { cityRequired, line1Required, nameRequired, outsideArea, phoneInvalid } from './copy';

function draft(overrides: Partial<AddressDraft> = {}): AddressDraft {
  return {
    label: 'home',
    line1: 'Flat 302',
    line2: '7th Cross',
    landmark: '  ',
    city: 'Bengaluru',
    pincode: '560 011',
    receiverName: 'Priya',
    receiverPhone: '9845012345',
    callOnArrival: true,
    leaveWithSecurity: false,
    dontRingBell: false,
    liftNotWorking: false,
    riderNote: ' ',
    deliverNow: true,
    pin: null,
    ...overrides,
  };
}

describe('address form', () => {
  it('accepts a Bengaluru pincode and rejects the rest', () => {
    expect(deliversHere('560011')).toBe(true);
    expect(deliversHere('560 011')).toBe(true);
    expect(deliversHere('400001')).toBe(false);
    expect(deliversHere('56001')).toBe(false);
    expect(deliversHere('')).toBe(false);
  });

  it('starts from a saved address or a fresh sheet', () => {
    expect(emptyDraft(null, null)).toMatchObject({
      label: 'home',
      city: 'Bengaluru',
      line1: '',
      landmark: '',
      callOnArrival: true,
      deliverNow: true,
      pin: null,
    });
    expect(emptyDraft(null, { latitude: 1, longitude: 2 }).pin).toEqual({
      latitude: 1,
      longitude: 2,
    });
    const blank = addressFixture({
      landmark: null,
      riderNote: null,
      latitude: null,
      longitude: null,
      selected: false,
      callOnArrival: false,
    });
    expect(emptyDraft(blank, { latitude: 3, longitude: 4 })).toMatchObject({
      landmark: '',
      riderNote: '',
      callOnArrival: false,
      deliverNow: false,
      pin: { latitude: 3, longitude: 4 },
      receiverPhone: '9845012345',
    });
    const placed = addressFixture({
      label: 'work',
      landmark: 'Temple',
      riderNote: 'Ring',
      latitude: 12.9,
      longitude: 77.6,
    });
    expect(emptyDraft(placed, null)).toMatchObject({
      label: 'work',
      landmark: 'Temple',
      riderNote: 'Ring',
      pin: { latitude: 12.9, longitude: 77.6 },
    });
  });

  it('keeps a pin only when both coordinates are present', () => {
    expect(startingPin(null, null)).toBeNull();
    expect(startingPin(null, { latitude: 1, longitude: 2 })).toEqual({ latitude: 1, longitude: 2 });
    expect(startingPin(addressFixture({ latitude: null, longitude: 2 }), null)).toBeNull();
    expect(
      startingPin(addressFixture({ latitude: 1, longitude: null }), { latitude: 8, longitude: 9 }),
    ).toEqual({ latitude: 8, longitude: 9 });
    expect(startingPin(addressFixture({ latitude: 1, longitude: 2 }), null)).toEqual({
      latitude: 1,
      longitude: 2,
    });
  });

  it('checks the fields the rider needs', () => {
    expect(validateAddress(draft({ line1: ' ', line2: '', city: '', pincode: '400', receiverName: '', receiverPhone: '1' }))).toEqual({
      line1: line1Required,
      line2: expect.any(String),
      city: cityRequired,
      pincode: outsideArea,
      receiverName: nameRequired,
      receiverPhone: phoneInvalid,
    });
    expect(validateAddress(draft())).toEqual({});
  });

  it('trims optional text and sends the phone in E.164', () => {
    expect(toAddressInput(draft())).toMatchObject({
      landmark: null,
      riderNote: null,
      pincode: '560011',
      receiverPhone: '+919845012345',
      latitude: null,
      longitude: null,
      selected: true,
    });
    expect(
      toAddressInput(
        draft({
          landmark: ' Temple ',
          riderNote: ' Ring ',
          deliverNow: false,
          pin: { latitude: 1, longitude: 2 },
        }),
      ),
    ).toMatchObject({
      landmark: 'Temple',
      riderNote: 'Ring',
      latitude: 1,
      longitude: 2,
      selected: false,
    });
  });
});

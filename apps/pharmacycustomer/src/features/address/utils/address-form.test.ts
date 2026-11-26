import { addressFixture } from '../../../../test/address-fixture';
import {
  deliversHere,
  emptyDraft,
  startingPin,
  toAddressInput,
  validateAddress,
  type AddressDraft,
} from './address-form';
import {
  cityRequired,
  line1Required,
  nameRequired,
  phoneInvalid,
  pinRequired,
  placeUnread,
  serviceNote,
} from './copy';

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
      pin: null,
    });
    expect(emptyDraft(null, { latitude: 1, longitude: 2 }).pin).toEqual({
      latitude: 1,
      longitude: 2,
    });
    const blank = addressFixture({
      landmark: null,
      riderNote: null,
      latitude: 12.97,
      longitude: 77.59,
      selected: false,
      callOnArrival: false,
    });
    expect(emptyDraft(blank, { latitude: 3, longitude: 4 })).toMatchObject({
      landmark: '',
      riderNote: '',
      callOnArrival: false,
      pin: { latitude: 12.97, longitude: 77.59 },
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

  it('uses the saved pin, then a detected pin', () => {
    expect(startingPin(null, null)).toBeNull();
    expect(startingPin(null, { latitude: 1, longitude: 2 })).toEqual({ latitude: 1, longitude: 2 });
    expect(
      startingPin(addressFixture({ latitude: 1, longitude: 2 }), { latitude: 8, longitude: 9 }),
    ).toEqual({
      latitude: 1,
      longitude: 2,
    });
  });

  it('checks the fields the rider needs', () => {
    expect(
      validateAddress(
        draft({
          line1: ' ',
          line2: '',
          city: '',
          pincode: '400',
          receiverName: '',
          receiverPhone: '1',
        }),
      ),
    ).toEqual({
      line1: line1Required,
      line2: expect.any(String),
      city: cityRequired,
      pincode: serviceNote,
      receiverName: nameRequired,
      receiverPhone: phoneInvalid,
      pin: pinRequired,
    });
    expect(validateAddress(draft({ pincode: '', pin: { latitude: 1, longitude: 2 } })).pincode).toBe(
      placeUnread,
    );
    expect(validateAddress(draft({ pin: { latitude: 1, longitude: 2 } }))).toEqual({});
  });

  it('trims optional text and sends the phone in E.164', () => {
    expect(() => toAddressInput(draft(), true)).toThrow(pinRequired);
    expect(toAddressInput(draft({ pin: { latitude: 1, longitude: 2 } }), true)).toMatchObject({
      landmark: null,
      riderNote: null,
      latitude: 1,
      longitude: 2,
      selected: true,
    });
    expect(
      toAddressInput(
        draft({
          landmark: ' Temple ',
          riderNote: ' Ring ',
          pin: { latitude: 1, longitude: 2 },
        }),
        false,
      ),
    ).toMatchObject({
      landmark: 'Temple',
      riderNote: 'Ring',
      pincode: '560011',
      receiverPhone: '+919845012345',
      latitude: 1,
      longitude: 2,
      selected: false,
    });
  });
});

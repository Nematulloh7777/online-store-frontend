import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

export function getAvatar(user: any) {
    const avatar = createAvatar(initials, {
      seed: user,
      radius: 50,
      scale: 85,
      backgroundType: ["gradientLinear"],
    })
    const svg = avatar.toDataUri();
    return svg
}
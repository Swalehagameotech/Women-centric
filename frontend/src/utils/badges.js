export const NEW_LAUNCH_BADGE_IMAGE =
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779714263/sc-3_bu9enf.webp';

export function hasNewLaunchCategory(categories = []) {
  return categories.includes('New Launch');
}

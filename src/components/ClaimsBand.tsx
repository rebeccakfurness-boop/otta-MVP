import { ButtonLink } from "./Button";

export function ClaimsBand() {
  return (
    <section className="bg-ocean-700 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <h2 className="text-3xl text-white">Need to make a claim?</h2>
          <p className="mt-2 text-ocean-50">To learn how best to make a claim, visit our claims page.</p>
        </div>
        <ButtonLink href="/claims" variant="light" size="lg">
          Make a claim
        </ButtonLink>
      </div>
    </section>
  );
}

"use client";

import CommitmentForm from "@/app/UiComponents/student/Commitment";

export default function Page({ params: { id } }) {
  return <CommitmentForm id={id} />;
}

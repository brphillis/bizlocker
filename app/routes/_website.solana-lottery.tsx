import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import CountDown from "~/components/Indicators/Countdown";
import useNotification from "~/hooks/PageNotification";
import { getSolanaPrice_AUD } from "~/integrations/coinmarketcap/index.server";
import { WalletAdapterButton } from "~/integrations/wallets/solflare";
import background from "../assets/banners/solana-bg.jpg";

import {
  createSolanaTransaction,
  sendSolanaTransaction,
} from "~/integrations/wallets/solflare/index.server";
import { cartLoader } from "~/modules/Website/Cart/index.server";
import { ActionReturnTypes } from "~/utility/actionTypes";
import { validateForm } from "~/utility/validate";
import OutlineButton from "~/components/Buttons/OutlineButton";
import { ClientOnly } from "~/components/Client/ClientOnly";

export const meta: MetaFunction = ({ data }) => {
  const loaderMeta = (data as { meta: MetaType })?.meta;
  return [
    { title: "CLUTCH | Solana Lottery" },
    {
      name: "description",
      content: loaderMeta?.description,
    },
  ];
};

export const loader = async () => {
  const solanaPriceAUD = await getSolanaPrice_AUD();

  return { solanaPriceAUD };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { formEntries } = validateForm(await request.formData(), {});

  const { senderPublicKey, signedTransaction } = formEntries;

  switch (formEntries._action) {
    case "createSolanaTransaction": {
      const solanaTransaction = await createSolanaTransaction(
        senderPublicKey as string,
        500000000,
      );

      return { solanaTransaction };
    }

    case "sendSolanaTransaction": {
      const transactionResponse = await sendSolanaTransaction(
        signedTransaction as string,
      );

      return { transactionResponse };
    }

    case "processOrder": {
      const notification = {
        type: "success",
        message: "Entry Success.",
      };

      return { notification };
    }
  }
};

const SolanaLottery = () => {
  const { solanaPriceAUD } = useLoaderData<typeof cartLoader>();

  const { solanaTransaction, transactionResponse, notification } =
    (useActionData() as ActionReturnTypes) || {};

  useNotification(notification);

  const navigate = useNavigate();

  return (
    <div className="-mt-[1px]">
      <div className="flex flex-col pb-6 px-3">
        <div className="flex flex-col items-center gap-3">
          <div
            className="flex items-start pt-24 max-md:py-6 justify-center w-screen h-full min-h-[calc(100vh-64px)]"
            style={{
              backgroundImage: `url(${background})`,
            }}
          >
            <div className="text-center justify-center">
              <div>
                <h1 className="text-[88px] max-md:text-[64px] font-bold leading-[82px] max-md:leading-[62px] max-md:text-purple-400 text-purple-500">
                  CLUTCH LOTTERY
                </h1>

                <p className="py-6 font-semibold max-md:text-sm px-3 text-brand-white/75">
                  Compete in the Weekly Lottery to Win Big and Prepare for our
                  very own CLUTCH Token.
                </p>

                <div className="flex flex-col items-center gap-3">
                  <ClientOnly>
                    <WalletAdapterButton
                      solanaPriceAUD={solanaPriceAUD}
                      solanaTransaction={solanaTransaction}
                      transactionResponse={transactionResponse}
                      disableValidation={true}
                      checkoutButtonLabel="Submit Entry"
                    />
                  </ClientOnly>
                  <p className="text-brand-white/75 text-sm">
                    0.5 SOL per entry.
                  </p>
                </div>

                <div>
                  <div className="stats shadow max-md:ml-0 mt-6 max-md:stats-vertical">
                    <div className="stat">
                      <div className="stat-title">Current Prize</div>
                      <div className="stat-value">271.09 SOL</div>
                    </div>

                    <div className="stat">
                      <div className="stat-title">Entries</div>
                      <div className="stat-value">38</div>
                    </div>

                    <div className="stat">
                      <div className="stat-title max-md:pb-2">Drawn</div>
                      <CountDown targetDate={new Date(Date.UTC(2024, 2, 17))} />
                    </div>
                  </div>
                </div>

                <div className="pt-6 select-none text-brand-white/75">
                  <p className="font-bold pb-1 text-xl max-md:text-lg">
                    Ticket Holders Gain
                  </p>
                  <p className="text-sm pb-1">Weekly Prizes</p>
                  <p className="text-sm pb-1">
                    Access to <b>$CLUTCH</b> Presale
                  </p>
                  <p className="text-sm pb-1">Discount on Retail</p>
                  <p className="text-sm pb-1">More Details Below...</p>
                </div>

                <OutlineButton
                  label="Go to Shop"
                  onClick={() => navigate("/products")}
                  extendStyle="border-purple-500/50 text-purple-500/50 mt-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center pb-6 px-6 text-center">
        <h1 className="text-5xl max-md:text-3xl font-bold py-3">
          Revolutionizing Solana Lottery Participation
        </h1>

        <div className="py-6 max-w-[1120px]">
          In the vibrant world of blockchain technology and decentralized
          finance, innovation knows no bounds. Enter <b>CLUTCH</b> Lottery, a
          groundbreaking Solana-based lottery platform poised to redefine how
          users engage with gaming, retail, and token economies. With a
          commitment to transparency, inclusivity, and community empowerment,
          CLUTCH Lottery offers users an unparalleled opportunity to participate
          in weekly draws, gain access to exclusive token presales, and unlock a
          plethora of benefits through the <b>CLUTCH</b> token ecosystem.
        </div>

        <h1 className="text-3xl font-bold pt-6">Participation Grants</h1>

        <div className="pt-6 pb-1">Weekly Jackpot Chance</div>
        <div className="py-1">Access to CLUTCH Presale</div>
        <div className="py-1">CLUTCH Token Airdrop</div>

        <h1 className="text-3xl font-bold pt-12">CLUTCH Token Benefits</h1>

        <div className="pt-6 py-1">Free Weekly Lottery Tickets</div>
        <div className="pb-1">Discounts On Products</div>
        <div className="pb-1">Free Shipping</div>
        <div className="py-1">Stock Governence</div>
        <div className="py-1">Priority Access to Limited Edition Items</div>
        <div className="py-1">Discounts With Partners</div>

        <h1 className="text-3xl font-bold pt-12">Lottery Population</h1>
        <div className="pt-6 py-1">
          10% of Retail profit from SOL sales into Jackpot
        </div>
        <div className="py-1">
          5% of Retail profit into <b>CLUTCH</b> liquidity pool
        </div>
        <div className="pb-1">0.4 SOL per ticket into Jackpot</div>
        <div className="pb-1">
          0.1 SOL per ticket into <b>CLUTCH</b> liquidity pool
        </div>

        <h1 className="text-3xl font-bold pt-12">How CLUTCH Works</h1>

        <div className="py-6 max-w-[1120px]">
          At the core of CLUTCH Lottery lies simplicity and accessibility. Users
          can effortlessly participate by entering the lottery once per wallet
          per week, with each entry requiring a nominal fee of 0.5 Solana. The
          lottery draws occur on a weekly basis, ensuring regular excitement and
          engagement within the community.
        </div>

        <div className="pb-6 max-w-[1120px]">
          Moreover, <b>CLUTCH</b> Lottery demonstrates its commitment to
          community enrichment by sharing the success of its retail ventures
          with participants. A portion of the profits generated from Solana
          retail sales is earmarked to further augment both the jackpot and the
          liquidity pool, ensuring that users reap tangible rewards beyond the
          lottery itself.
        </div>

        <h1 className="text-3xl font-bold pt-6">The Power of CLUTCH</h1>

        <div className="py-6 max-w-[1120px]">
          While <b>CLUTCH</b> Lottery serves as the cornerstone of the platform,
          its true potential is unlocked through the <b>CLUTCH</b> token
          ecosystem. Holding <b>CLUTCH</b> tokens offers a myriad of benefits,
          transforming mere participants into valued stakeholders:
        </div>

        <div className="py-6 max-w-[1120px]">
          <b>Free Weekly Lottery Entries:</b> <b>CLUTCH</b> token holders enjoy
          the privilege of receiving complimentary entries into the weekly
          lottery, amplifying their chances of winning without additional
          expenditure.
        </div>

        <div className="py-6 max-w-[1120px]">
          <b>Retail Discounts and Free Shipping:</b> Embracing the intersection
          of gaming and retail, <b>CLUTCH</b> token holders are entitled to
          exclusive discounts and free shipping on a diverse array of retail
          products.
        </div>

        <div className="py-6 max-w-[1120px]">
          <b>Community Governance:</b> The <b>CLUTCH</b> token empowers holders
          to actively participate in the governance of the platform, influencing
          decisions regarding the selection of brands and products available in
          the retail ecosystem.
        </div>

        <div className="py-6 max-w-[1120px]">
          <b>Partner Benefits:</b> Collaboration is key in the blockchain space.{" "}
          <b>CLUTCH</b> token holders gain access to discounted offerings on
          partner retail websites, fostering a symbiotic relationship that
          rewards community loyalty.
        </div>

        <div className="py-6 max-w-[1120px]">
          In essence, the <b>CLUTCH</b> token transcends its role as a mere
          utility, evolving into a gateway to a dynamic ecosystem where
          participation is not just rewarding but empowering.
        </div>
      </div>
    </div>
  );
};

export default SolanaLottery;

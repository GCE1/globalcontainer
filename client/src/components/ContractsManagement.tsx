import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, CheckCircle, Clock, Eye } from "lucide-react";

export default function ContractsManagement() {
  const [agreementTerms, setAgreementTerms] = useState({
    termsAccepted: false,
    authorityConfirmed: false,
    storageFeesUnderstood: false
  });
  const [isSigningContract, setIsSigningContract] = useState(false);
  const { toast } = useToast();

  const handleRadioChange = (field: string, value: boolean) => {
    setAgreementTerms(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const allTermsAccepted = agreementTerms.termsAccepted && agreementTerms.authorityConfirmed && agreementTerms.storageFeesUnderstood;

  const handleSignAgreement = async () => {
    if (!allTermsAccepted) {
      toast({
        title: "Agreement Required",
        description: "Please accept all terms and conditions before signing.",
        variant: "destructive",
      });
      return;
    }

    setIsSigningContract(true);
    
    // Simulate API call for signing contract
    setTimeout(() => {
      setIsSigningContract(false);
      toast({
        title: "Contract Signed Successfully",
        description: "You have successfully signed the Container Wholesale Agreement. You will receive a confirmation email shortly.",
        variant: "default",
      });
    }, 2000);
  };

  // Sample contract data
  const activeContracts = [
    {
      id: "CW-2024-001",
      containerType: "40ft Dry Container (5 units)",
      startDate: "01/15/2024",
      endDate: "07/15/2024",
      status: "Active",
      totalValue: "$25,000"
    },
    {
      id: "CW-2024-002", 
      containerType: "20ft Refrigerated Container (2 units)",
      startDate: "02/10/2024",
      endDate: "05/10/2024",
      status: "Active",
      totalValue: "$18,000"
    }
  ];

  const contractHistory = [
    {
      id: "CW-2023-045",
      containerType: "40ft Dry Container (3 units)",
      startDate: "10/05/2023",
      endDate: "01/05/2024",
      status: "Completed",
      totalValue: "$15,000"
    },
    {
      id: "CW-2023-032",
      containerType: "20ft Open Top Container (1 unit)",
      startDate: "08/15/2023",
      endDate: "12/15/2023",
      status: "Completed",
      totalValue: "$8,500"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="new-contract" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="new-contract" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 rounded-md transition-all duration-200"
          >
            New Contract
          </TabsTrigger>
          <TabsTrigger 
            value="my-contracts"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 rounded-md transition-all duration-200"
          >
            My Contracts
          </TabsTrigger>
        </TabsList>

        {/* New Contract Tab */}
        <TabsContent value="new-contract" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[#001937] text-center flex items-center justify-center gap-3">
                <FileText className="h-7 w-7 text-green-600" />
                GCE Container Wholesale Agreement
              </CardTitle>
              <CardDescription className="text-center">
                Please review the container wholesale agreement below. You must agree to all terms and conditions before proceeding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scrollable Agreement Text */}
              <div className="max-h-96 overflow-y-auto p-6 border border-gray-200 rounded-lg bg-gray-50 text-sm leading-6">
                <div className="space-y-4">
                  <h3 className="text-center text-lg font-bold text-[#001937]">STANDARD CONTAINER WHOLESALE AGREEMENT</h3>
                  
                  <p><strong>This Container Wholesale Agreement</strong> (the "Agreement") is entered into as of the date of acceptance by and between:</p>
                  
                  <p><strong>CONTAINER WHOLESALE PLATFORM INC.</strong>, a corporation organized under the laws of [State/Country], with its principal place of business at [Address] (hereinafter referred to as the "SELLER");</p>
                  
                  <p>AND</p>
                  
                  <p><strong>THE CUSTOMER</strong> (hereinafter referred to as the "BUYER").</p>
                  
                  <p>SELLER and BUYER may be individually referred to as a "Party" and collectively as the "Parties."</p>

                  <h4 className="font-bold text-[#001937] mt-6">1. DEFINITIONS</h4>
                  <p>For the purposes of this Agreement, the following terms shall have the meanings set forth below:</p>
                  <p><strong>1.1 "Container(s)"</strong> means the shipping container(s) sold by SELLER to BUYER as described in the Order Confirmation, including all parts and components thereof.</p>
                  <p><strong>1.2 "Purchase Date"</strong> means the date on which payment for the Container(s) is confirmed by SELLER.</p>
                  <p><strong>1.3 "Wholesale Rate"</strong> means the purchase price payable by BUYER to SELLER for the Container(s) as specified in the Order Confirmation.</p>
                  <p><strong>1.4 "Free Days"</strong> means the seven (7) days following payment confirmation during which BUYER may pick up the Container(s) from the depot without incurring any storage fees.</p>
                  <p><strong>1.5 "Overdue Storage Fee"</strong> means the daily rate charged for each container remaining at the depot after the Free Days have expired, as specified in the Order Confirmation.</p>
                  <p><strong>1.6 "Order Confirmation"</strong> means the document issued by SELLER confirming the specific details of the Container(s) purchase, including but not limited to the type, quantity, Wholesale Rate, Free Days, and applicable Overdue Storage Fees.</p>
                  <p><strong>1.7 "Delivery Date"</strong> means the date on which the Container(s) are delivered to BUYER or BUYER's designated agent or location, which may be up to ninety (90) days from the Purchase Date.</p>
                  <p><strong>1.8 "Depot Release Number"</strong> means the unique identifier provided by SELLER to BUYER within seven (7) business days after payment confirmation, which is required for Container(s) pickup from the depot.</p>

                  <h4 className="font-bold text-[#001937] mt-6">2. SALE OF CONTAINERS</h4>
                  <p><strong>2.1</strong> SELLER hereby sells to BUYER, and BUYER hereby purchases from SELLER, the Container(s) described in the Order Confirmation, subject to the terms and conditions of this Agreement.</p>
                  <p><strong>2.2</strong> Upon full payment and delivery, the Container(s) shall become the property of BUYER, and BUYER shall acquire full right, title, and interest in the Container(s), subject to the terms and conditions of this Agreement.</p>

                  <h4 className="font-bold text-[#001937] mt-6">3. DELIVERY AND TRANSFER OF OWNERSHIP</h4>
                  <p><strong>3.1</strong> Transfer of ownership shall occur upon full payment and delivery of the Container(s) to BUYER. BUYER acknowledges that delivery may take up to ninety (90) days from the Purchase Date.</p>
                  <p><strong>3.2</strong> BUYER may request expedited delivery by contacting SELLER. Expedited delivery requests shall be subject to SELLER's written approval and may be subject to additional fees as determined by SELLER.</p>

                  <h4 className="font-bold text-[#001937] mt-6">4. WHOLESALE RATE AND PAYMENT TERMS</h4>
                  <p><strong>4.1</strong> BUYER shall pay to SELLER the Wholesale Rate as specified in the Order Confirmation.</p>
                  <p><strong>4.2</strong> Unless otherwise specified in the Order Confirmation, payment of the Wholesale Rate shall be made in advance.</p>
                  <p><strong>4.3</strong> Upon purchase of containers, BUYER shall be entitled to seven (7) Free Days for container pickup from the depot. After these seven (7) Free Days have expired, BUYER shall pay to SELLER the overdue storage fee for each additional day that the Container(s) remain at the depot.</p>
                  <p><strong>4.4</strong> Overdue storage fees shall be assessed at the rate specified in the Order Confirmation per container per day and shall be invoiced weekly in arrears. These fees shall be payable within fifteen (15) days of the invoice date.</p>
                  <p><strong>4.5</strong> All payments made by BUYER to SELLER under this Agreement shall be made without any deduction, withholding, or set-off whatsoever.</p>
                  <p><strong>4.6</strong> If BUYER fails to make any payment due under this Agreement by the due date for payment, then, without limiting SELLER's remedies, BUYER shall pay interest on the overdue amount at a rate of 1.5% per month. Such interest shall accrue on a daily basis from the due date until actual payment of the overdue amount, whether before or after judgment.</p>

                  <h4 className="font-bold text-[#001937] mt-6">5. DELIVERY AND PICKUP</h4>
                  <p><strong>5.1</strong> SELLER shall deliver the Container(s) to BUYER on the Delivery Date at the location specified in the Order Confirmation. BUYER acknowledges and agrees that delivery of purchased containers may take up to ninety (90) days from the date of purchase.</p>
                  <p><strong>5.2</strong> Depot release numbers will be provided to BUYER within seven (7) business days after confirmation of payment. BUYER acknowledges that container pickup from depots cannot be completed without a valid release number.</p>
                  <p><strong>5.3</strong> BUYER shall inspect the Container(s) upon delivery or pickup and shall immediately notify SELLER in writing of any defects or damages. If BUYER fails to provide such notice within twenty-four (24) hours of delivery or pickup, the Container(s) shall be deemed to have been delivered in good condition and in accordance with the Order Confirmation.</p>
                  <p><strong>5.4</strong> If BUYER elects to pick up Container(s) from a depot, BUYER must do so within seven (7) days of receiving the depot release number. After this period, BUYER shall be subject to overdue storage fees as outlined in Section 4.</p>
                  <p><strong>5.5</strong> BUYER is responsible for arranging transportation from the depot to their desired location, unless otherwise specified in the Order Confirmation. SELLER may assist in arranging transportation for an additional fee upon BUYER's request.</p>

                  <h4 className="font-bold text-[#001937] mt-6">6. BUYER'S OBLIGATIONS</h4>
                  <p><strong>6.1</strong> BUYER shall:</p>
                  <p className="ml-4"><strong>(a)</strong> Promptly arrange for pickup or delivery of the Container(s) according to the terms of this Agreement;</p>
                  <p className="ml-4"><strong>(b)</strong> Not use the Container(s) for storing or transporting any hazardous, toxic, flammable, explosive, or illegal substances or materials in violation of any applicable laws or regulations;</p>
                  <p className="ml-4"><strong>(c)</strong> Comply with all applicable laws, regulations, and industry standards relating to the possession, use, and operation of the Container(s);</p>
                  <p className="ml-4"><strong>(d)</strong> During any storage at SELLER's depot, not access the Container(s) without prior arrangement and supervision by SELLER's authorized personnel;</p>
                  <p className="ml-4"><strong>(e)</strong> Pay all applicable taxes, duties, and fees related to the purchase and use of the Container(s), including but not limited to sales tax, import duties, and customs fees;</p>
                  <p className="ml-4"><strong>(f)</strong> Ensure that transportation of the Container(s) from the depot is conducted by qualified and insured carriers;</p>
                  <p className="ml-4"><strong>(g)</strong> Promptly notify SELLER of any damage or defects discovered during inspection at delivery or pickup; and</p>
                  <p className="ml-4"><strong>(h)</strong> Allow SELLER or its representatives to inspect the Container(s) at the depot prior to pickup or delivery, upon reasonable prior notice.</p>

                  <h4 className="font-bold text-[#001937] mt-6">7. WARRANTIES AND CONDITION</h4>
                  <p><strong>7.1</strong> SELLER warrants that the Container(s) shall be delivered to BUYER in cargo-worthy condition suitable for their intended use, free from structural defects that would render them unfit for normal use in shipping or storage.</p>
                  <p><strong>7.2</strong> Any Container(s) found to have pre-existing structural defects upon delivery or pickup must be reported to SELLER within twenty-four (24) hours for replacement or repair at SELLER's expense. After this inspection period, all Container(s) are considered accepted in as-is condition.</p>
                  <p><strong>7.3</strong> After transfer of ownership, BUYER shall be solely responsible for all maintenance, repairs, and upkeep of the Container(s), and SELLER shall have no further obligation with respect to the condition or maintenance of the Container(s).</p>

                  <h4 className="font-bold text-[#001937] mt-6">8. INSURANCE</h4>
                  <p><strong>8.1</strong> SELLER shall maintain appropriate insurance coverage for the Container(s) while they remain at SELLER's depot or until ownership is transferred to BUYER, whichever occurs first.</p>
                  <p><strong>8.2</strong> BUYER is responsible for obtaining appropriate insurance coverage for the Container(s) during transportation from the depot and after transfer of ownership. BUYER is strongly advised to maintain:</p>
                  <p className="ml-4"><strong>(a)</strong> Property insurance covering the Container(s) against loss or damage by fire, theft, vandalism, and other risks, in an amount not less than the replacement value of the Container(s);</p>
                  <p className="ml-4"><strong>(b)</strong> Commercial general liability insurance with adequate coverage limits per occurrence, covering liability for bodily injury, death, and property damage arising out of the use, possession, or transport of the Container(s).</p>
                  <p><strong>8.3</strong> SELLER shall not be responsible for any loss or damage to the Container(s) after transfer of ownership or during transportation arranged by BUYER.</p>

                  <h4 className="font-bold text-[#001937] mt-6">9. LIABILITY AND INDEMNIFICATION</h4>
                  <p><strong>9.1</strong> SELLER shall be liable for any loss of or damage to the Container(s) prior to transfer of ownership to BUYER, except to the extent such loss or damage is caused by the negligence or willful misconduct of BUYER or its representatives during inspection or pickup.</p>
                  <p><strong>9.2</strong> After transfer of ownership, BUYER assumes all liability for the Container(s) and SELLER shall have no further liability for any loss, damage, or injury related to the Container(s), regardless of cause.</p>
                  <p><strong>9.3</strong> BUYER shall indemnify, defend, and hold harmless SELLER and its officers, directors, employees, agents, and representatives from and against any and all claims, demands, suits, actions, proceedings, judgments, losses, damages, costs, and expenses (including reasonable attorneys' fees) arising out of or in connection with:</p>
                  <p className="ml-4"><strong>(a)</strong> Any breach of this Agreement by BUYER;</p>
                  <p className="ml-4"><strong>(b)</strong> Any use, possession, operation, or transportation of the Container(s) after transfer of ownership;</p>
                  <p className="ml-4"><strong>(c)</strong> Any property damage or bodily injury, including death, caused by or related to the Container(s) after transfer of ownership; and</p>
                  <p className="ml-4"><strong>(d)</strong> Any violation of applicable laws, regulations, or industry standards by BUYER or its representatives in connection with the use, possession, operation, or transportation of the Container(s).</p>

                  <h4 className="font-bold text-[#001937] mt-6">10. LIMITATION OF LIABILITY</h4>
                  <p><strong>10.1</strong> UNDER NO CIRCUMSTANCES SHALL SELLER BE LIABLE TO BUYER OR ANY THIRD PARTY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES OF ANY KIND, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, LOSS OF BUSINESS, LOSS OF USE, OR LOSS OF DATA, REGARDLESS OF THE FORM OF ACTION, WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR OTHERWISE, EVEN IF SELLER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
                  <p><strong>10.2</strong> SELLER'S TOTAL LIABILITY TO BUYER FOR ANY AND ALL CLAIMS, LOSSES, AND DAMAGES ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT SHALL NOT EXCEED THE TOTAL PURCHASE PRICE ACTUALLY PAID BY BUYER TO SELLER UNDER THIS AGREEMENT.</p>
                  <p><strong>10.3</strong> The limitations of liability set forth in this Section 10 shall not apply to: (a) damages arising out of SELLER's gross negligence or willful misconduct; or (b) any other liability that cannot be excluded or limited under applicable law.</p>

                  <h4 className="font-bold text-[#001937] mt-6">11. DEFAULT AND REMEDIES</h4>
                  <p><strong>11.1</strong> Each of the following events shall constitute an "Event of Default" by BUYER under this Agreement:</p>
                  <p className="ml-4"><strong>(a)</strong> BUYER fails to pay any amount due under this Agreement within fifteen (15) days after the due date;</p>
                  <p className="ml-4"><strong>(b)</strong> BUYER breaches any other provision of this Agreement and fails to cure such breach within thirty (30) days after receipt of written notice thereof from SELLER;</p>
                  <p className="ml-4"><strong>(c)</strong> BUYER becomes insolvent, files for bankruptcy, or has a petition in bankruptcy filed against it that is not dismissed within sixty (60) days;</p>
                  <p className="ml-4"><strong>(d)</strong> BUYER makes an assignment for the benefit of creditors or enters into any arrangement with its creditors;</p>
                  <p className="ml-4"><strong>(e)</strong> A receiver, trustee, or similar officer is appointed for BUYER or for a substantial part of its assets; or</p>
                  <p className="ml-4"><strong>(f)</strong> BUYER ceases to carry on business.</p>
                  <p><strong>11.2</strong> Upon the occurrence of an Event of Default prior to the transfer of ownership, SELLER may, at its option and without prejudice to any other rights or remedies available to it:</p>
                  <p className="ml-4"><strong>(a)</strong> Terminate this Agreement with immediate effect by providing written notice to BUYER;</p>
                  <p className="ml-4"><strong>(b)</strong> Retain the Container(s) and any partial payments made as liquidated damages;</p>
                  <p className="ml-4"><strong>(c)</strong> Require BUYER to immediately pay all amounts due under this Agreement; and/or</p>
                  <p className="ml-4"><strong>(d)</strong> Pursue any other remedy available at law or in equity.</p>
                  <p><strong>11.3</strong> After transfer of ownership, SELLER's remedies shall be limited to recovering any unpaid amounts due under this Agreement, including overdue storage fees, along with any costs of collection including reasonable attorneys' fees.</p>

                  <h4 className="font-bold text-[#001937] mt-6">12. FORCE MAJEURE</h4>
                  <p><strong>12.1</strong> Neither Party shall be liable for any failure or delay in performing its obligations under this Agreement (other than obligations to make payment) if such failure or delay is caused by circumstances beyond that Party's reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, riots, civil unrest, government action, strikes, lockouts, or other labor disputes ("Force Majeure Event").</p>
                  <p><strong>12.2</strong> A Party affected by a Force Majeure Event shall promptly notify the other Party of the nature and extent of the circumstances causing the failure or delay.</p>
                  <p><strong>12.3</strong> If a Force Majeure Event continues for a period of thirty (30) days or more, either Party may terminate this Agreement by providing written notice to the other Party, without liability for such termination.</p>

                  <h4 className="font-bold text-[#001937] mt-6">13. NOTICES</h4>
                  <p><strong>13.1</strong> All notices and other communications under this Agreement shall be in writing and shall be deemed given when: (a) delivered by hand; (b) sent by registered or certified mail, return receipt requested; (c) sent by nationally recognized overnight courier service; or (d) sent by email with confirmation of receipt, to the addresses specified in the Order Confirmation or to such other address as a Party may specify by notice to the other Party.</p>

                  <h4 className="font-bold text-[#001937] mt-6">14. GOVERNING LAW AND DISPUTE RESOLUTION</h4>
                  <p><strong>14.1</strong> This Agreement shall be governed by and construed in accordance with the laws of [State/Country], without giving effect to any choice of law or conflict of law provisions.</p>
                  <p><strong>14.2</strong> Any dispute, controversy, or claim arising out of or in connection with this Agreement, including any question regarding its existence, validity, or termination, shall be resolved as follows:</p>
                  <p className="ml-4"><strong>(a)</strong> The Parties shall first attempt to resolve the dispute through good faith negotiations, which shall not exceed thirty (30) days from the date on which the dispute is first notified in writing by one Party to the other;</p>
                  <p className="ml-4"><strong>(b)</strong> If the dispute is not resolved through negotiations, the Parties shall submit the dispute to mediation under the rules of the American Arbitration Association (or another mutually agreeable mediation service). The mediation shall take place in [City, State/Country] and shall not exceed sixty (60) days from the date of submission to mediation;</p>
                  <p className="ml-4"><strong>(c)</strong> If the dispute is not resolved through mediation, the dispute shall be finally resolved by binding arbitration under the rules of the American Arbitration Association. The arbitration shall take place in [City, State/Country], shall be conducted in the English language, and shall be decided by a panel of three arbitrators appointed in accordance with such rules.</p>
                  <p><strong>14.3</strong> Notwithstanding Section 14.2, either Party may seek injunctive or other equitable relief from a court of competent jurisdiction at any time.</p>

                  <h4 className="font-bold text-[#001937] mt-6">15. CONFIDENTIALITY</h4>
                  <p><strong>15.1</strong> Each Party agrees to maintain the confidentiality of any proprietary or confidential information of the other Party disclosed in connection with this Agreement ("Confidential Information") and to use such Confidential Information only for the purposes of performing its obligations under this Agreement.</p>
                  <p><strong>15.2</strong> The obligations of confidentiality shall not apply to information that: (a) is or becomes publicly available through no fault of the receiving Party; (b) is rightfully received by the receiving Party from a third party without restriction on disclosure; (c) is independently developed by the receiving Party without use of or reference to the Confidential Information; or (d) is required to be disclosed by law or governmental order, provided that the receiving Party gives the disclosing Party prompt notice of such requirement and cooperates with the disclosing Party's efforts to limit such disclosure.</p>

                  <h4 className="font-bold text-[#001937] mt-6">16. MISCELLANEOUS</h4>
                  <p><strong>16.1 Assignment.</strong> BUYER shall not assign, transfer, or delegate any of its rights or obligations under this Agreement without the prior written consent of SELLER. SELLER may assign, transfer, or delegate its rights and obligations under this Agreement to any affiliate or successor in interest without BUYER's consent.</p>
                  <p><strong>16.2 Entire Agreement.</strong> This Agreement, together with the Order Confirmation, constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, understandings, negotiations, and discussions, whether oral or written.</p>
                  <p><strong>16.3 Amendment.</strong> No amendment, modification, or waiver of any provision of this Agreement shall be effective unless in writing and signed by both Parties.</p>
                  <p><strong>16.4 Severability.</strong> If any provision of this Agreement is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not in any way be affected or impaired.</p>
                  <p><strong>16.5 No Waiver.</strong> No failure or delay by either Party in exercising any right, power, or remedy under this Agreement shall operate as a waiver thereof, nor shall any single or partial exercise of such right, power, or remedy preclude any other or further exercise thereof or the exercise of any other right, power, or remedy.</p>
                  <p><strong>16.6 Relationship of Parties.</strong> Nothing in this Agreement shall be construed to create a partnership, joint venture, employment, or agency relationship between the Parties. Neither Party shall have the authority to bind the other Party or to incur any obligation on behalf of the other Party.</p>
                  <p><strong>16.7 Survival.</strong> The provisions of Sections 9, 10, 13, 14, 15, and 16 shall survive the termination or expiration of this Agreement.</p>
                  <p><strong>16.8 Counterparts.</strong> This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument. Electronic or digital signatures shall be deemed original signatures for all purposes.</p>

                  <p className="mt-6 text-center font-semibold">IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date of acceptance indicated below.</p>
                </div>
              </div>

              {/* Agreement Terms & Conditions */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-[#001937]">Agreement to Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="terms-accepted"
                        id="terms-accepted"
                        checked={agreementTerms.termsAccepted}
                        onClick={() => handleRadioChange('termsAccepted', !agreementTerms.termsAccepted)}
                      />
                      <Label htmlFor="terms-accepted" className="text-sm">
                        I have read, understood, and agree to be bound by the terms and conditions of this Container Wholesale Agreement.
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="authority-confirmed"
                        id="authority-confirmed"
                        checked={agreementTerms.authorityConfirmed}
                        onClick={() => handleRadioChange('authorityConfirmed', !agreementTerms.authorityConfirmed)}
                      />
                      <Label htmlFor="authority-confirmed" className="text-sm">
                        I confirm that I have the authority to enter into this Agreement on behalf of the BUYER.
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="storage-fees-understood"
                        id="storage-fees-understood"
                        checked={agreementTerms.storageFeesUnderstood}
                        onClick={() => handleRadioChange('storageFeesUnderstood', !agreementTerms.storageFeesUnderstood)}
                      />
                      <Label htmlFor="storage-fees-understood" className="text-sm">
                        I understand the storage fees and acknowledge that Container(s) must be picked up within seven (7) days to avoid overdue storage fees.
                      </Label>
                    </div>
                  </RadioGroup>

                  <Button
                    onClick={handleSignAgreement}
                    disabled={!allTermsAccepted || isSigningContract}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSigningContract ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Signing Agreement...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Sign Agreement
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Contracts Tab */}
        <TabsContent value="my-contracts" className="mt-6">
          <div className="space-y-6">
            {/* Active Contracts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#001937] flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  My Active Contracts
                </CardTitle>
                <CardDescription>
                  Current wholesale contracts and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Contract #</th>
                        <th className="text-left p-3 font-medium">Container Type</th>
                        <th className="text-left p-3 font-medium">Start Date</th>
                        <th className="text-left p-3 font-medium">End Date</th>
                        <th className="text-left p-3 font-medium">Total Value</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeContracts.map((contract) => (
                        <tr key={contract.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{contract.id}</td>
                          <td className="p-3">{contract.containerType}</td>
                          <td className="p-3">{contract.startDate}</td>
                          <td className="p-3">{contract.endDate}</td>
                          <td className="p-3 font-medium">{contract.totalValue}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(contract.status)}>
                              {contract.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Contract History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#001937] flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Contract History
                </CardTitle>
                <CardDescription>
                  Previously completed wholesale contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Contract #</th>
                        <th className="text-left p-3 font-medium">Container Type</th>
                        <th className="text-left p-3 font-medium">Start Date</th>
                        <th className="text-left p-3 font-medium">End Date</th>
                        <th className="text-left p-3 font-medium">Total Value</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contractHistory.map((contract) => (
                        <tr key={contract.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{contract.id}</td>
                          <td className="p-3">{contract.containerType}</td>
                          <td className="p-3">{contract.startDate}</td>
                          <td className="p-3">{contract.endDate}</td>
                          <td className="p-3 font-medium">{contract.totalValue}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(contract.status)}>
                              {contract.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}